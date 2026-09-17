"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { formatMobile } from "@/lib/validations";

export function DonateNotifyForm({
  methods,
}: {
  methods: Array<"BANK" | "JAZZCASH" | "EASYPAISA">;
}) {
  const t = useTranslations("donate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [mobile, setMobile] = useState("");

  const available = methods.length > 0 ? methods : (["BANK"] as const);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("notifyFailed"));
      }
      setSuccessRef(data.referenceNo);
      form.reset();
      setMobile("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("notifyFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (successRef) {
    return (
      <div className="surface-card bg-brand-green-soft p-6 sm:p-8">
        <p className="text-brand-green font-medium text-lg leading-relaxed">
          {t("notifySuccess", { ref: successRef })}
        </p>
        <p className="mt-3 font-mono text-sm font-semibold text-brand-green-deep">
          {successRef}
        </p>
        <button
          type="button"
          className="btn-outline mt-6"
          onClick={() => setSuccessRef(null)}
        >
          {t("notifyAnother")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" encType="multipart/form-data">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="donorName">{t("donorName")}</label>
          <input id="donorName" name="donorName" required minLength={3} />
        </div>
        <div className="field">
          <label htmlFor="mobile">{t("donorMobile")}</label>
          <input
            id="mobile"
            name="mobile"
            required
            value={mobile}
            onChange={(e) => setMobile(formatMobile(e.target.value))}
            placeholder="03XXXXXXXXX"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="email">{t("donorEmail")}</label>
          <input id="email" name="email" type="email" />
        </div>
        <div className="field">
          <label htmlFor="amount">{t("amount")}</label>
          <input
            id="amount"
            name="amount"
            type="number"
            min={1}
            step="1"
            required
            placeholder="5000"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="method">{t("method")}</label>
          <select id="method" name="method" required defaultValue={available[0]}>
            {available.map((method) => (
              <option key={method} value={method}>
                {method === "BANK"
                  ? t("bank")
                  : method === "JAZZCASH"
                    ? t("jazzcash")
                    : t("easypaisa")}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="transactionId">{t("transactionId")}</label>
          <input id="transactionId" name="transactionId" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="proof">{t("proof")}</label>
        <input
          id="proof"
          name="proof"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
        />
        <p className="mt-1 text-xs text-brand-muted">{t("proofHint")}</p>
      </div>

      <div className="field">
        <label htmlFor="notes">{t("notes")}</label>
        <textarea id="notes" name="notes" rows={3} maxLength={500} />
      </div>

      <button type="submit" className="btn-donate" disabled={loading}>
        {loading ? t("submitting") : t("submitNotify")}
      </button>
    </form>
  );
}
