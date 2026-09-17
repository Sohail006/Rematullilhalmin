import Link from "next/link";
import { redirect } from "next/navigation";
import { FileDown, Search } from "lucide-react";
import { getSession, hasPermission } from "@/lib/auth";
import { APPLICATION_STATUSES } from "@/lib/constants";
import { formatDatePK } from "@/lib/datetime";
import { prisma } from "@/lib/db";

type SearchParams = {
  status?: string;
  q?: string;
};

function buildQuery(params: { status?: string; q?: string }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.q) query.set("q", params.q);
  const text = query.toString();
  return text ? `?${text}` : "";
}

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session, "applications.view")) {
    redirect("/admin");
  }

  const params = await searchParams;
  const status =
    params.status &&
    APPLICATION_STATUSES.includes(
      params.status as (typeof APPLICATION_STATUSES)[number],
    )
      ? params.status
      : undefined;
  const q = params.q?.trim() || "";

  const where = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { referenceNo: { contains: q, mode: "insensitive" as const } },
            { fullName: { contains: q, mode: "insensitive" as const } },
            { guardianName: { contains: q, mode: "insensitive" as const } },
            { cnic: { contains: q.replace(/[-\s]/g, "") } },
            { mobile: { contains: q.replace(/\D/g, "") || q } },
            { schoolName: { contains: q, mode: "insensitive" as const } },
            { city: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [applications, pendingCount, approvedCount, rejectedCount, approvedSum] =
    await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.application.count({ where: { status: "PENDING" } }),
      prisma.application.count({ where: { status: "APPROVED" } }),
      prisma.application.count({ where: { status: "REJECTED" } }),
      prisma.application.aggregate({
        where: { status: "APPROVED" },
        _sum: { feeAmount: true },
      }),
    ]);

  const approvedTotal = approvedSum._sum.feeAmount || 0;
  const filteredTotal = applications.reduce((sum, item) => sum + item.feeAmount, 0);
  const exportHref = `/api/admin/applications/export${buildQuery({ status, q })}`;

  const filters = [
    { key: "ALL", href: `/admin/applications${buildQuery({ q })}`, active: !status },
    {
      key: "PENDING",
      href: `/admin/applications${buildQuery({ status: "PENDING", q })}`,
      active: status === "PENDING",
    },
    {
      key: "APPROVED",
      href: `/admin/applications${buildQuery({ status: "APPROVED", q })}`,
      active: status === "APPROVED",
    },
    {
      key: "REJECTED",
      href: `/admin/applications${buildQuery({ status: "REJECTED", q })}`,
      active: status === "REJECTED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-green">
            Applications
          </h1>
          <p className="text-brand-muted mt-1">
            Review student aid requests. Approved aid is paid to schools.
          </p>
        </div>
        <a
          href={exportHref}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand-gold rounded bg-brand-gold/10 text-brand-green font-medium hover:bg-brand-gold/20 text-sm"
        >
          <FileDown className="h-3.5 w-3.5" />
          Export CSV
        </a>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pending review" value={String(pendingCount)} tone="amber" />
        <StatCard label="Approved" value={String(approvedCount)} tone="green" />
        <StatCard label="Rejected" value={String(rejectedCount)} tone="red" />
        <StatCard
          label="Approved fee total"
          value={`PKR ${approvedTotal.toLocaleString()}`}
          tone="ink"
        />
      </div>

      <div className="bg-white border border-brand-green/10 p-4 space-y-4">
        <form
          method="get"
          action="/admin/applications"
          className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end"
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
                placeholder="Reference, student, CNIC, mobile, school, city…"
                className="!ps-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="submit" className="btn-primary py-2.5 px-4 text-sm">
              Apply
            </button>
            {q ? (
              <Link
                href={`/admin/applications${buildQuery({ status })}`}
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

      <p className="text-sm text-brand-muted">
        Showing{" "}
        <span className="font-semibold text-brand-ink">{applications.length}</span>{" "}
        application{applications.length === 1 ? "" : "s"}
        {applications.length > 0 ? (
          <>
            {" "}
            · listed fees{" "}
            <span className="font-semibold text-brand-ink">
              PKR {filteredTotal.toLocaleString()}
            </span>
          </>
        ) : null}
      </p>

      <div className="overflow-x-auto bg-white border border-brand-green/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-cream text-brand-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <p className="text-brand-muted">
                    {q || status
                      ? "No applications match these filters."
                      : "No applications yet."}
                  </p>
                  {q || status ? (
                    <Link
                      href="/admin/applications"
                      className="inline-block mt-3 text-brand-green font-medium hover:underline"
                    >
                      View all applications
                    </Link>
                  ) : (
                    <p className="mt-2 text-sm text-brand-muted max-w-md mx-auto">
                      New requests appear here after families submit the public Apply
                      form.
                    </p>
                  )}
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  className={`border-t border-brand-green/10 ${
                    app.status === "PENDING" ? "bg-amber-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-brand-green font-medium hover:underline font-mono text-xs sm:text-sm"
                    >
                      {app.referenceNo}
                    </Link>
                    <p className="text-xs text-brand-muted mt-0.5">{app.city}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-brand-ink">{app.fullName}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{app.mobile}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{app.schoolName}</p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Class {app.classGrade}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    PKR {app.feeAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted whitespace-nowrap">
                    {formatDatePK(app.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="text-xs font-semibold text-brand-green hover:underline"
                    >
                      {app.status === "PENDING" ? "Review" : "Open"}
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800",
    APPROVED: "bg-brand-green-soft text-brand-green",
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
