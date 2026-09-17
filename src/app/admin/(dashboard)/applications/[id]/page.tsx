import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { formatDateTimePK } from "@/lib/datetime";
import { prisma } from "@/lib/db";
import { DecisionForm } from "@/components/admin/DecisionForm";
import { PrintButton } from "@/components/admin/PrintButton";

function isImageDoc(url: string) {
  return /\.(jpe?g|png|webp|gif)(\?|$)/i.test(url);
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || !hasPermission(session, "applications.view")) {
    redirect("/admin");
  }

  const { id } = await params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      decisions: {
        include: { decidedBy: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!application) notFound();

  const canDecide = hasPermission(session, "applications.decide");
  const showDecideForm = canDecide && application.status === "PENDING";

  const fields = [
    ["Reference", application.referenceNo],
    ["Applicant type", application.applicantType],
    ["Student name", application.fullName],
    ["Guardian", application.guardianName],
    ["CNIC", application.cnic],
    ["Mobile", application.mobile],
    ["Email", application.email || "—"],
    ["City", application.city],
    ["Address", application.address],
    ["School", application.schoolName],
    ["School address", application.schoolAddress],
    ["Class", application.classGrade],
    ["Previous marks", application.previousMarks],
    ["Fee amount", `PKR ${application.feeAmount.toLocaleString()}`],
    ["Submitted", formatDateTimePK(application.createdAt)],
    ["Income info", application.incomeInfo],
    [
      "Disability",
      application.hasDisability
        ? application.disabilityInfo || "Yes"
        : "No",
    ],
  ] as const;

  const documents = [
    { label: "Fee challan", url: application.feeChallanUrl },
    { label: "B-Form / CNIC", url: application.bFormUrl },
    { label: "Income certificate", url: application.incomeCertUrl },
  ];

  return (
    <div className="space-y-8 max-w-4xl application-print">
      <div className="flex flex-wrap items-start justify-between gap-4 no-print">
        <div>
          <Link
            href="/admin/applications"
            className="text-sm text-brand-muted hover:text-brand-green"
          >
            ← Back to applications
          </Link>
          <h1 className="font-display text-3xl font-semibold text-brand-green mt-3">
            {application.referenceNo}
          </h1>
          <p className="text-brand-muted mt-1">{application.fullName}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={application.status} />
          <PrintButton label="Print application" />
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="font-display text-2xl font-semibold text-brand-green">
          Al Sirat Ul Mustaqeem Foundation
        </h1>
        <p className="text-sm text-brand-muted">
          Application: {application.referenceNo}
        </p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2 bg-white border border-brand-green/10 p-6">
        {fields.map(([label, value]) => (
          <div
            key={label}
            className={
              label === "Income info" ||
              label === "Address" ||
              label === "School address"
                ? "sm:col-span-2"
                : ""
            }
          >
            <dt className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              {label}
            </dt>
            <dd className="mt-1 text-brand-ink whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="bg-white border border-brand-green/10 p-6 space-y-4">
        <h2 className="font-semibold text-brand-green">Documents</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.label} className="space-y-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-brand-green font-medium hover:underline"
              >
                {doc.label}
              </a>
              {isImageDoc(doc.url) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={doc.url}
                  alt={doc.label}
                  className="max-h-40 w-full rounded-lg border border-brand-green/10 object-contain bg-brand-cream"
                />
              ) : (
                <p className="text-xs text-brand-muted">Open link to view PDF</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showDecideForm ? (
        <div className="no-print">
          <DecisionForm applicationId={application.id} />
        </div>
      ) : null}

      {application.status === "PENDING" && !canDecide ? (
        <div className="no-print rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This application is awaiting a decision. Your account can view requests
          but does not have permission to approve or reject them.
        </div>
      ) : null}

      {application.decisions.length > 0 ? (
        <div className="bg-white border border-brand-green/10 p-6 space-y-4">
          <h2 className="font-semibold text-brand-green">Decision history</h2>
          {application.decisions.map((decision) => (
            <div key={decision.id} className="border-s-2 border-brand-gold ps-4">
              <p className="font-medium">
                {decision.action} by {decision.decidedBy.fullName}
              </p>
              <p className="text-sm text-brand-muted mt-1">{decision.comments}</p>
              <p className="text-xs text-brand-muted mt-1">
                {formatDateTimePK(decision.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : null}
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
      className={`rounded px-3 py-1 text-sm font-semibold ${styles[status] || "bg-brand-cream text-brand-green"}`}
    >
      {status}
    </span>
  );
}
