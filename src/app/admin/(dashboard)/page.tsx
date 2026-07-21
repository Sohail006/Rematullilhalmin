import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession, hasPermission } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const [pending, approved, rejected, total] = await Promise.all([
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.application.count({ where: { status: "APPROVED" } }),
    prisma.application.count({ where: { status: "REJECTED" } }),
    prisma.application.count(),
  ]);

  const cards = [
    { label: "Pending", value: pending, color: "text-amber-700" },
    { label: "Approved", value: approved, color: "text-brand-green" },
    { label: "Rejected", value: rejected, color: "text-red-700" },
    { label: "Total", value: total, color: "text-brand-ink" },
  ];

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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-brand-green/10 p-5"
          >
            <p className="text-sm text-brand-muted">{card.label}</p>
            <p className={`mt-2 text-3xl font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {hasPermission(session, "applications.view") ? (
          <Link href="/admin/applications" className="btn-primary">
            Review applications
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
