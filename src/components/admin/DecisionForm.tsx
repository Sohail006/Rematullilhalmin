"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function DecisionForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const commentsRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function decide(action: "APPROVED" | "REJECTED") {
    const comments = commentsRef.current?.value.trim() || "";
    if (comments.length < 5) {
      setMessage(null);
      setError("Please add comments (at least 5 characters).");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/admin/applications/${applicationId}/decide`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, comments }),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Decision failed. Please try again.",
        );
        return;
      }

      setMessage(
        action === "APPROVED"
          ? "Application approved. Aid will be paid to the school."
          : "Application rejected.",
      );
      router.refresh();
    } catch {
      setError("Decision failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-brand-green/10 p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-brand-green">Board decision</h2>
        <p className="text-sm text-brand-muted mt-1">
          If approved, the foundation will contact the family for next steps and
          pay the school directly — never cash to the household. If an email was
          provided, the applicant will receive this decision automatically.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}
      {message ? (
        <div
          role="status"
          className="rounded-xl border border-brand-green/25 bg-brand-green-soft px-4 py-3 text-sm font-medium text-brand-green"
        >
          {message}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="comments">
          Comments <span className="text-red-600">*</span>
        </label>
        <textarea
          id="comments"
          ref={commentsRef}
          rows={4}
          required
          minLength={5}
          placeholder="e.g. Documents verified. Approve PKR 15,000 school fee for Class 8."
          onChange={() => {
            setError(null);
            setMessage(null);
          }}
        />
        <p className="mt-1 text-xs text-brand-muted">Minimum 5 characters.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={loading}
          onClick={() => void decide("APPROVED")}
        >
          {loading ? "Saving…" : "Approve"}
        </button>
        <button
          type="button"
          className="rounded bg-red-700 text-white px-4 py-3 font-semibold disabled:opacity-60"
          disabled={loading}
          onClick={() => void decide("REJECTED")}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
