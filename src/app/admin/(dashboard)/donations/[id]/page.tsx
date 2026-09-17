import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DonationDecisionForm } from "@/components/admin/DonationDecisionForm";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DonationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session, "donations.view")) {
    redirect("/admin");
  }

  const { id } = await params;
  const donation = await prisma.donation.findUnique({
    where: { id },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { reviewedBy: { select: { fullName: true, username: true } } },
      },
    },
  });

  if (!donation) notFound();

  const canManage = hasPermission(session, "donations.manage");

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/donations"
            className="text-sm text-brand-green hover:underline"
          >
            ← Back to donations
          </Link>
          <h1 className="font-display text-3xl font-semibold text-brand-green mt-2">
            {donation.referenceNo}
          </h1>
          <p className="text-brand-muted mt-1">{donation.donorName}</p>
        </div>
        <span className="rounded px-3 py-1 text-sm font-semibold bg-brand-cream text-brand-green">
          {donation.status}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 bg-white border border-brand-green/10 p-6 text-sm">
        <Field label="Amount" value={`PKR ${donation.amount.toLocaleString()}`} />
        <Field label="Method" value={donation.method} />
        <Field label="Mobile" value={donation.mobile} />
        <Field label="Email" value={donation.email || "—"} />
        <Field label="Transaction ID" value={donation.transactionId || "—"} />
        <Field
          label="Submitted"
          value={donation.createdAt.toLocaleString()}
        />
        <div className="sm:col-span-2">
          <p className="text-brand-muted">Notes</p>
          <p className="mt-1 text-brand-ink whitespace-pre-wrap">
            {donation.notes || "—"}
          </p>
        </div>
        {donation.proofUrl ? (
          <div className="sm:col-span-2">
            <p className="text-brand-muted">Payment proof</p>
            <a
              href={donation.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-brand-green font-medium hover:underline break-all"
            >
              View uploaded proof
            </a>
          </div>
        ) : null}
      </div>

      {donation.status === "PENDING" && canManage ? (
        <DonationDecisionForm donationId={donation.id} />
      ) : null}

      {donation.reviews.length > 0 ? (
        <div className="bg-white border border-brand-green/10 p-6 space-y-4">
          <h2 className="font-semibold text-brand-green">Review history</h2>
          {donation.reviews.map((review) => (
            <div key={review.id} className="border-t border-brand-green/10 pt-3 text-sm">
              <p className="font-medium text-brand-ink">
                {review.action} by {review.reviewedBy.fullName}
              </p>
              <p className="text-brand-muted mt-1">{review.comments}</p>
              <p className="text-xs text-brand-muted mt-1">
                {review.createdAt.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-brand-muted">{label}</p>
      <p className="mt-1 text-brand-ink font-medium">{value}</p>
    </div>
  );
}
