import Link from "next/link";
import { redirect } from "next/navigation";
import { FileDown, Search } from "lucide-react";
import { getSession, hasPermission } from "@/lib/auth";
import { DONATION_METHODS, DONATION_STATUSES } from "@/lib/constants";
import { formatDatePK } from "@/lib/datetime";
import { prisma } from "@/lib/db";

type SearchParams = {
  status?: string;
  method?: string;
  q?: string;
};

function buildQuery(params: {
  status?: string;
  method?: string;
  q?: string;
}) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.method) query.set("method", params.method);
  if (params.q) query.set("q", params.q);
  const text = query.toString();
  return text ? `?${text}` : "";
}

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session, "donations.view")) {
    redirect("/admin");
  }

  const params = await searchParams;
  const status =
    params.status &&
    DONATION_STATUSES.includes(params.status as (typeof DONATION_STATUSES)[number])
      ? params.status
      : undefined;
  const method =
    params.method &&
    DONATION_METHODS.includes(params.method as (typeof DONATION_METHODS)[number])
      ? params.method
      : undefined;
  const q = params.q?.trim() || "";

  const where = {
    ...(status ? { status } : {}),
    ...(method ? { method } : {}),
    ...(q
      ? {
          OR: [
            { referenceNo: { contains: q, mode: "insensitive" as const } },
            { donorName: { contains: q, mode: "insensitive" as const } },
            { mobile: { contains: q } },
            { email: { contains: q, mode: "insensitive" as const } },
            { transactionId: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [donations, pendingCount, confirmedCount, rejectedCount, confirmedSum] =
    await Promise.all([
      prisma.donation.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.donation.count({ where: { status: "PENDING" } }),
      prisma.donation.count({ where: { status: "CONFIRMED" } }),
      prisma.donation.count({ where: { status: "REJECTED" } }),
      prisma.donation.aggregate({
        where: { status: "CONFIRMED" },
        _sum: { amount: true },
      }),
    ]);

  const confirmedTotal = confirmedSum._sum.amount || 0;
  const filteredTotal = donations.reduce((sum, item) => sum + item.amount, 0);
  const canManageSettings = hasPermission(session, "settings.donate");
  const exportHref = `/api/admin/donations/export${buildQuery({ status, method, q })}`;

  const filters = [
    { key: "ALL", href: `/admin/donations${buildQuery({ method, q })}`, active: !status },
    {
      key: "PENDING",
      href: `/admin/donations${buildQuery({ status: "PENDING", method, q })}`,
      active: status === "PENDING",
    },
    {
      key: "CONFIRMED",
      href: `/admin/donations${buildQuery({ status: "CONFIRMED", method, q })}`,
      active: status === "CONFIRMED",
    },
    {
      key: "REJECTED",
      href: `/admin/donations${buildQuery({ status: "REJECTED", method, q })}`,
      active: status === "REJECTED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-green">
            Donations
          </h1>
          <p className="text-brand-muted mt-1">
            Review donor payment notifications and confirm received gifts
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm items-center">
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-gold rounded bg-brand-gold/10 text-brand-green font-medium hover:bg-brand-gold/20"
          >
            <FileDown className="h-3.5 w-3.5" />
            Export CSV
          </a>
          {canManageSettings ? (
            <Link
              href="/admin/settings/donate"
              className="px-3 py-1.5 border border-brand-green/20 rounded hover:bg-brand-green-soft"
            >
              Donate settings
            </Link>
          ) : null}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending review" value={String(pendingCount)} tone="amber" />
        <StatCard label="Confirmed" value={String(confirmedCount)} tone="green" />
        <StatCard label="Rejected" value={String(rejectedCount)} tone="red" />
        <StatCard
          label="Confirmed total"
          value={`PKR ${confirmedTotal.toLocaleString()}`}
          tone="ink"
        />
      </div>

      <div className="bg-white border border-brand-green/10 p-4 space-y-4">
        <form
          method="get"
          action="/admin/donations"
          className="grid gap-3 lg:grid-cols-[1fr_180px_auto] lg:items-end"
        >
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <div className="field mb-0">
            <label htmlFor="q">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Reference, donor, mobile, transaction ID…"
                className="!ps-9"
              />
            </div>
          </div>
          <div className="field mb-0">
            <label htmlFor="method">Method</label>
            <select id="method" name="method" defaultValue={method || ""}>
              <option value="">All methods</option>
              {DONATION_METHODS.map((item) => (
                <option key={item} value={item}>
                  {item === "BANK"
                    ? "Bank transfer"
                    : item === "JAZZCASH"
                      ? "JazzCash"
                      : "EasyPaisa"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary py-2.5 px-4 text-sm">
              Apply
            </button>
            {q || method ? (
              <Link
                href={`/admin/donations${buildQuery({ status })}`}
                className="btn-outline py-2.5 px-4 text-sm"
              >
                Clear
              </Link>
            ) : null}
          </div>
        </form>

        <div className="flex flex-wrap gap-2 text-sm">
          {filters.map((filter) => (
            <Link
              key={filter.key}
              href={filter.href}
              className={`px-3 py-1.5 border rounded font-medium ${
                filter.active
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-brand-green/20 text-brand-green hover:bg-brand-green-soft"
              }`}
            >
              {filter.key}
              {filter.key === "PENDING" ? ` (${pendingCount})` : ""}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-brand-muted">
        <p>
          Showing <span className="font-semibold text-brand-ink">{donations.length}</span>{" "}
          report{donations.length === 1 ? "" : "s"}
          {donations.length > 0 ? (
            <>
              {" "}
              · listed amount{" "}
              <span className="font-semibold text-brand-ink">
                PKR {filteredTotal.toLocaleString()}
              </span>
            </>
          ) : null}
        </p>
      </div>

      <div className="overflow-x-auto bg-white border border-brand-green/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-cream text-brand-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Proof</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center">
                  <p className="text-brand-muted">
                    {q || status || method
                      ? "No donations match these filters."
                      : "No donation reports yet."}
                  </p>
                  {!q && !status && !method ? (
                    <p className="mt-2 text-sm text-brand-muted max-w-md mx-auto">
                      Reports appear here after donors submit the notify form on the
                      public Donate page.
                    </p>
                  ) : (
                    <Link
                      href="/admin/donations"
                      className="inline-block mt-3 text-brand-green font-medium hover:underline"
                    >
                      View all donations
                    </Link>
                  )}
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr
                  key={donation.id}
                  className={`border-t border-brand-green/10 ${
                    donation.status === "PENDING" ? "bg-amber-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/donations/${donation.id}`}
                      className="text-brand-green font-medium hover:underline font-mono text-xs sm:text-sm"
                    >
                      {donation.referenceNo}
                    </Link>
                    {donation.transactionId ? (
                      <p className="text-xs text-brand-muted mt-0.5 truncate max-w-[10rem]">
                        Txn: {donation.transactionId}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-ink">{donation.donorName}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{donation.mobile}</p>
                  </td>
                  <td className="px-4 py-3">
                    <MethodLabel method={donation.method} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    PKR {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {donation.proofUrl ? (
                      <a
                        href={donation.proofUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-green hover:underline text-xs font-semibold"
                      >
                        View
                      </a>
                    ) : (
                      <span className="text-xs text-brand-muted">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={donation.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                    {formatDatePK(donation.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/donations/${donation.id}`}
                      className="text-xs font-semibold text-brand-green hover:underline"
                    >
                      {donation.status === "PENDING" ? "Review" : "Open"}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "green" | "red" | "ink";
}) {
  const tones = {
    amber: "text-amber-700",
    green: "text-brand-green",
    red: "text-red-700",
    ink: "text-brand-ink",
  };
  return (
    <div className="bg-white border border-brand-green/10 p-4">
      <p className="text-xs text-brand-muted uppercase tracking-wide">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
}

function MethodLabel({ method }: { method: string }) {
  const labels: Record<string, string> = {
    BANK: "Bank",
    JAZZCASH: "JazzCash",
    EASYPAISA: "EasyPaisa",
  };
  return <span>{labels[method] || method}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800",
    CONFIRMED: "bg-brand-green-soft text-brand-green",
    REJECTED: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${styles[status] || ""}`}
    >
      {status}
    </span>
  );
}
