import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession, hasPermission } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const canViewApps = hasPermission(session, "applications.view");
  const canViewDonations = hasPermission(session, "donations.view");

  const [pending, approved, rejected, total, donationsPending, donationsTotal] =
    await Promise.all([
      canViewApps
        ? prisma.application.count({ where: { status: "PENDING" } })
        : Promise.resolve(0),
      canViewApps
        ? prisma.application.count({ where: { status: "APPROVED" } })
        : Promise.resolve(0),
      canViewApps
        ? prisma.application.count({ where: { status: "REJECTED" } })
        : Promise.resolve(0),
      canViewApps ? prisma.application.count() : Promise.resolve(0),
      canViewDonations
        ? prisma.donation.count({ where: { status: "PENDING" } })
        : Promise.resolve(0),
      canViewDonations ? prisma.donation.count() : Promise.resolve(0),
    ]);

  const cards = [
    canViewApps
      ? {
          label: "Pending applications",
          value: pending,
          color: "text-amber-700",
          href: "/admin/applications?status=PENDING",
        }
      : null,
    canViewApps
      ? {
          label: "Approved",
          value: approved,
          color: "text-brand-green",
          href: "/admin/applications?status=APPROVED",
        }
      : null,
    canViewApps
      ? {
          label: "Rejected",
          value: rejected,
          color: "text-red-700",
          href: "/admin/applications?status=REJECTED",
        }
      : null,
    canViewApps
      ? {
          label: "Total applications",
          value: total,
          color: "text-brand-ink",
          href: "/admin/applications",
        }
      : null,
    canViewDonations
      ? {
          label: "Pending donations",
          value: donationsPending,
          color: "text-amber-700",
          href: "/admin/donations?status=PENDING",
        }
      : null,
    canViewDonations
      ? {
          label: "Total donations",
          value: donationsTotal,
          color: "text-brand-ink",
          href: "/admin/donations",
        }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: number;
    color: string;
    href: string;
  }>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          Dashboard
        </h1>
        <p className="text-brand-muted mt-1">
          Welcome, {session.fullName}. Role: {session.roleName}
        </p>
      </div>

      {cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-brand-green/10 p-5 transition-colors hover:border-brand-green/30 hover:bg-brand-green-soft/40"
            >
              <p className="text-sm text-brand-muted">{card.label}</p>
              <p className={`mt-2 text-3xl font-semibold ${card.color}`}>
                {card.value}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-brand-muted text-sm">
          No review modules are available for your role.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {canViewApps ? (
          <Link href="/admin/applications?status=PENDING" className="btn-primary">
            Review applications
          </Link>
        ) : null}
        {canViewDonations ? (
          <Link href="/admin/donations?status=PENDING" className="btn-donate">
            Review donations
          </Link>
        ) : null}
        {hasPermission(session, "settings.contact") ? (
          <Link href="/admin/settings/contact" className="btn-outline">
            Contact settings
          </Link>
        ) : null}
        {hasPermission(session, "settings.donate") ? (
          <Link href="/admin/settings/donate" className="btn-outline">
            Donate settings
          </Link>
        ) : null}
      </div>
    </div>
  );
}
