import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DonationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session, "donations.view")) {
    redirect("/admin");
  }

  const { status } = await searchParams;
  const where =
    status && ["PENDING", "CONFIRMED", "REJECTED"].includes(status)
      ? { status }
      : {};

  const donations = await prisma.donation.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-brand-green">
            Donations
          </h1>
          <p className="text-brand-muted mt-1">
            Review donor payment notifications
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm items-center">
          {["ALL", "PENDING", "CONFIRMED", "REJECTED"].map((s) => (
            <Link
              key={s}
              href={
                s === "ALL" ? "/admin/donations" : `/admin/donations?status=${s}`
              }
              className="px-3 py-1.5 border border-brand-green/20 rounded hover:bg-brand-green-soft"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-brand-green/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-cream text-brand-muted">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Donor</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-muted">
                  No donations found
                </td>
              </tr>
            ) : (
              donations.map((donation) => (
                <tr key={donation.id} className="border-t border-brand-green/10">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/donations/${donation.id}`}
                      className="text-brand-green font-medium hover:underline"
                    >
                      {donation.referenceNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{donation.donorName}</td>
                  <td className="px-4 py-3">{donation.method}</td>
                  <td className="px-4 py-3">
                    PKR {donation.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={donation.status} />
                  </td>
                  <td className="px-4 py-3 text-brand-muted">
                    {donation.createdAt.toLocaleDateString()}
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
