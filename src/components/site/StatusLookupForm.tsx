"use client";

import { useTranslations, useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { formatDateTimePK } from "@/lib/datetime";
import { formatCnic, formatMobile } from "@/lib/validations";

type ApplicationResult = {
  type?: "application";
  referenceNo: string;
  fullName: string;
  status: string;
  submittedAt: string;
  schoolName: string;
  feeAmount: number;
  decision: {
    action: string;
    comments: string;
    decidedAt: string;
  } | null;
};

type DonationResult = {
  type: "donation";
  referenceNo: string;
  donorName: string;
  status: string;
  submittedAt: string;
  amount: number;
  method: string;
  decision: {
    action: string;
    comments: string;
    decidedAt: string;
  } | null;
};

type StatusResult = ApplicationResult | DonationResult;

function isDonationRef(referenceNo: string) {
  return referenceNo.toUpperCase().startsWith("ASM-DON-");
}

export function StatusLookupForm() {
  const t = useTranslations("status");
  const locale = useLocale();
  const [referenceNo, setReferenceNo] = useState("");
  const [cnic, setCnic] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);

  const donationMode = useMemo(
    () => isDonationRef(referenceNo),
    [referenceNo],
  );

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const endpoint = donationMode
        ? "/api/donations/status"
        : "/api/applications/status";
      const body = donationMode
        ? { referenceNo, mobile }
        : { referenceNo, cnic };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("error"));
      }
      setResult(
        donationMode
          ? { ...data, type: "donation" }
          : { ...data, type: "application" },
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  const appStatusLabel: Record<string, string> = {
    PENDING: t("pending"),
    APPROVED: t("approved"),
    REJECTED: t("rejected"),
  };

  const donationStatusLabel: Record<string, string> = {
    PENDING: t("donationPending"),
    CONFIRMED: t("donationConfirmed"),
    REJECTED: t("donationRejected"),
  };

  const statusClass: Record<string, string> = {
    PENDING: "status-pill status-pill-pending",
    APPROVED: "status-pill status-pill-approved",
    CONFIRMED: "status-pill status-pill-approved",
    REJECTED: "status-pill status-pill-rejected",
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <p className="text-sm text-brand-muted leading-relaxed">{t("hint")}</p>
        <div className="field">
          <label htmlFor="referenceNo">{t("referenceNo")}</label>
          <input
            id="referenceNo"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value.toUpperCase())}
            placeholder={donationMode ? "ASM-DON-2026-123456" : "ASM-2026-123456"}
            required
          />
        </div>
        {donationMode ? (
          <div className="field">
            <label htmlFor="mobile">{t("mobile")}</label>
            <input
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(formatMobile(e.target.value))}
              placeholder="03XXXXXXXXX"
              required
            />
          </div>
        ) : (
          <div className="field">
            <label htmlFor="cnic">{t("cnic")}</label>
            <input
              id="cnic"
              value={cnic}
              onChange={(e) => setCnic(formatCnic(e.target.value))}
              placeholder="XXXXX-XXXXXXX-X"
              required
            />
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? t("checking") : t("check")}
        </button>
      </form>

      {result && result.type === "donation" ? (
        <div className="surface-card p-6 max-w-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-brand-muted">{t("referenceNo")}</p>
              <p className="font-mono font-semibold text-brand-green">
                {result.referenceNo}
              </p>
            </div>
            <span className={statusClass[result.status] || "status-pill"}>
              {donationStatusLabel[result.status] || result.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("donor")}</p>
            <p className="font-medium text-brand-ink">{result.donorName}</p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("amount")}</p>
            <p className="text-brand-ink">
              PKR {result.amount.toLocaleString()} ·{" "}
              {result.method === "BANK"
                ? t("methodBank")
                : result.method === "JAZZCASH"
                  ? t("methodJazzcash")
                  : result.method === "EASYPAISA"
                    ? t("methodEasypaisa")
                    : result.method}
            </p>
          </div>
          {result.decision ? (
            <div className="border-t border-brand-green/10 pt-4">
              <p className="text-sm font-semibold text-brand-green">
                {t("boardComments")}
              </p>
              <p className="mt-1 text-brand-muted leading-relaxed">
                {result.decision.comments}
              </p>
              <p className="text-xs text-brand-muted mt-2">
                {formatDateTimePK(result.decision.decidedAt, locale)}
              </p>
            </div>
          ) : null}
          {result.status === "PENDING" ? (
            <p className="text-sm text-amber-800 font-medium rounded-xl bg-amber-50 px-4 py-3">
              {t("donationPendingNote")}
            </p>
          ) : null}
          {result.status === "CONFIRMED" ? (
            <p className="text-sm text-brand-green font-medium rounded-xl bg-brand-green-soft px-4 py-3">
              {t("donationConfirmedNote")}
            </p>
          ) : null}
          {result.status === "REJECTED" ? (
            <p className="text-sm text-red-700 font-medium rounded-xl bg-red-50 px-4 py-3">
              {t("donationRejectedNote")}
            </p>
          ) : null}
        </div>
      ) : null}

      {result && result.type !== "donation" ? (
        <div className="surface-card p-6 max-w-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-brand-muted">{t("referenceNo")}</p>
              <p className="font-mono font-semibold text-brand-green">
                {result.referenceNo}
              </p>
            </div>
            <span className={statusClass[result.status] || "status-pill"}>
              {appStatusLabel[result.status] || result.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("student")}</p>
            <p className="font-medium text-brand-ink">{result.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("school")}</p>
            <p className="text-brand-ink">{result.schoolName}</p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("fee")}</p>
            <p className="text-brand-ink">
              PKR {result.feeAmount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("submitted")}</p>
            <p className="text-brand-ink">
              {formatDateTimePK(result.submittedAt, locale)}
            </p>
          </div>
          {result.decision ? (
            <div className="border-t border-brand-green/10 pt-4">
              <p className="text-sm font-semibold text-brand-green">
                {t("boardComments")}
              </p>
              <p className="mt-1 text-brand-muted leading-relaxed">
                {result.decision.comments}
              </p>
              <p className="text-xs text-brand-muted mt-2">
                {formatDateTimePK(result.decision.decidedAt, locale)}
              </p>
            </div>
          ) : null}
          {result.status === "PENDING" ? (
            <p className="text-sm text-amber-800 font-medium rounded-xl bg-amber-50 px-4 py-3">
              {t("pendingNote")}
            </p>
          ) : null}
          {result.status === "APPROVED" ? (
            <p className="text-sm text-brand-green font-medium rounded-xl bg-brand-green-soft px-4 py-3">
              {t("approvedNote")}
            </p>
          ) : null}
          {result.status === "REJECTED" ? (
            <p className="text-sm text-red-700 font-medium rounded-xl bg-red-50 px-4 py-3">
              {t("rejectedNote")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
