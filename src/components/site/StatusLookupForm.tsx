"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatCnic } from "@/lib/validations";

type StatusResult = {
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

export function StatusLookupForm() {
  const t = useTranslations("status");
  const [referenceNo, setReferenceNo] = useState("");
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StatusResult | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceNo, cnic }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("error"));
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  const statusLabel: Record<string, string> = {
    PENDING: t("pending"),
    APPROVED: t("approved"),
    REJECTED: t("rejected"),
  };

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="space-y-4 max-w-md">
        {error ? (
          <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <div className="field">
          <label htmlFor="referenceNo">{t("referenceNo")}</label>
          <input
            id="referenceNo"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value.toUpperCase())}
            placeholder="ASM-2026-123456"
            required
          />
        </div>
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
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "..." : t("check")}
        </button>
      </form>

      {result ? (
        <div className="rounded border border-brand-green/20 bg-brand-green-soft p-6 max-w-lg space-y-4">
          <div>
            <p className="text-sm text-brand-muted">{t("referenceNo")}</p>
            <p className="font-mono font-semibold text-brand-green">
              {result.referenceNo}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("student")}</p>
            <p className="font-medium">{result.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("statusLabel")}</p>
            <p className="font-semibold text-brand-green">
              {statusLabel[result.status] || result.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-brand-muted">{t("school")}</p>
            <p>{result.schoolName}</p>
          </div>
          {result.decision ? (
            <div className="border-t border-brand-green/15 pt-4">
              <p className="text-sm font-semibold text-brand-green">
                {t("boardComments")}
              </p>
              <p className="mt-1 text-brand-muted">{result.decision.comments}</p>
              <p className="text-xs text-brand-muted mt-2">
                {new Date(result.decision.decidedAt).toLocaleString()}
              </p>
            </div>
          ) : null}
          {result.status === "APPROVED" ? (
            <p className="text-sm text-brand-green font-medium">{t("approvedNote")}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
