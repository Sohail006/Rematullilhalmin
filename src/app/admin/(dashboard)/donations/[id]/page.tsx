import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DonationDecisionForm } from "@/components/admin/DonationDecisionForm";
import { PrintButton } from "@/components/admin/PrintButton";
import { getSession, hasPermission } from "@/lib/auth";
import { formatDateTimePK } from "@/lib/datetime";
import { prisma } from "@/lib/db";

function isImageProof(url: string) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url);
}

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
    <div className="space-y-6 max-w-4xl application-print">
      <div className="flex flex-wrap items-start justify-between gap-3 no-print">
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
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={donation.status} />
          <PrintButton label="Print donation" />
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-green">
          Al Sirat Ul Mustaqeem Foundation
        </h1>
        <p className="text-sm text-brand-muted">
          Donation: {donation.referenceNo}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 bg-white border border-brand-green/10 p-6 text-sm">
        <Field label="Amount" value={`PKR ${donation.amount.toLocaleString()}`} />
        <Field label="Method" value={methodLabel(donation.method)} />
        <Field label="Mobile" value={donation.mobile} />
        <Field label="Email" value={donation.email || "—"} />
        <Field label="Transaction ID" value={donation.transactionId || "—"} />
        <Field
          label="Submitted"
          value={formatDateTimePK(donation.createdAt)}
        />
        <div className="sm:col-span-2">
          <p className="text-brand-muted">Notes</p>
          <p className="mt-1 text-brand-ink whitespace-pre-wrap">
            {donation.notes || "—"}
          </p>
        </div>
        {donation.proofUrl ? (
          <div className="sm:col-span-2 space-y-3">
            <p className="text-brand-muted">Payment proof</p>
            <a
              href={donation.proofUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block text-brand-green font-medium hover:underline break-all"
            >
              Open uploaded proof
            </a>
            {isImageProof(donation.proofUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={donation.proofUrl}
                alt={`Proof for ${donation.referenceNo}`}
                className="mt-2 max-h-80 w-auto rounded-lg border border-brand-green/10 object-contain bg-brand-cream"
              />
            ) : (
              <p className="text-xs text-brand-muted">
                Preview available for image proofs; open the link for PDF files.
              </p>
            )}
          </div>
        ) : (
          <div className="sm:col-span-2">
            <p className="text-brand-muted">Payment proof</p>
            <p className="mt-1 text-brand-ink">No proof uploaded</p>
          </div>
        )}
      </div>

      {donation.status === "PENDING" && canManage ? (
        <div className="no-print">
          <DonationDecisionForm donationId={donation.id} />
        </div>
      ) : null}

      {donation.status === "PENDING" && !canManage ? (
        <div className="no-print rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This donation is awaiting confirmation. Your account can view reports
          but does not have permission to confirm or reject them.
        </div>
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
                {formatDateTimePK(review.createdAt)}
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

function methodLabel(method: string) {
  if (method === "BANK") return "Bank transfer";
  if (method === "JAZZCASH") return "JazzCash";
  if (method === "EASYPAISA") return "EasyPaisa";
  return method;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800",
    CONFIRMED: "bg-brand-green-soft text-brand-green",
    REJECTED: "bg-red-50 text-red-700",
  };
  return (
    <span
      className={`rounded px-3 py-1 text-sm font-semibold ${styles[status] || "bg-brand-cream text-brand-green"}`}
    >
      {status}
    </span>
  );
}
