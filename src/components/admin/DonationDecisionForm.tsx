"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function DonationDecisionForm({ donationId }: { donationId: string }) {
  const router = useRouter();
  const commentsRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(action: "CONFIRMED" | "REJECTED") {
    const comments = commentsRef.current?.value.trim() || "";
    if (comments.length < 5) {
      setError("Please add comments (at least 5 characters)");
      return;
    }

    setLoading(true);
    setError(null);
    const response = await fetch(`/api/admin/donations/${donationId}/decide`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, comments }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Decision failed");
      return;
    }

    router.refresh();
  }

  return (
    <div className="bg-white border border-brand-green/10 p-6 space-y-4">
      <h2 className="font-semibold text-brand-green">Confirm donation</h2>
      <p className="text-sm text-brand-muted">
        Verify the payment in your bank/wallet statement before confirming.
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="field">
        <label htmlFor="comments">Comments</label>
        <textarea
          id="comments"
          ref={commentsRef}
          rows={4}
          required
          minLength={5}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={loading}
          onClick={() => void decide("CONFIRMED")}
        >
          Confirm received
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
