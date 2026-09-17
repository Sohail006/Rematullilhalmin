"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { DonateSettings } from "@/lib/constants";
import { donateSettingsSchema, formatMobile } from "@/lib/validations";

type FieldErrors = Record<string, string>;

function pathKey(path: readonly PropertyKey[]) {
  return path.map(String).join(".");
}

function validateDonateForm(form: DonateSettings): FieldErrors {
  const parsed = donateSettingsSchema.safeParse(form);
  if (parsed.success) return {};

  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = pathKey(issue.path);
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

export function DonateSettingsForm({ initial }: { initial: DonateSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const localErrors = validateDonateForm(form);
    setFieldErrors(localErrors);
    if (Object.keys(localErrors).length > 0) {
      setError("Please fix the highlighted fields before saving.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/donate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.fieldErrors && typeof data.fieldErrors === "object") {
          setFieldErrors(data.fieldErrors as FieldErrors);
        }
        setError(
          typeof data.error === "string" ? data.error : "Save failed. Please try again.",
        );
        return;
      }

      setFieldErrors({});
      setMessage("Donate settings saved successfully. They are now live on the public Donate page.");
      setForm(data.settings ?? form);
      router.refresh();
    } catch {
      setError("Save failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
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

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.bank.enabled}
            onChange={(e) => {
              setMessage(null);
              setForm({
                ...form,
                bank: { ...form.bank, enabled: e.target.checked },
              });
            }}
          />
          Bank transfer
        </label>
        <p className="text-xs text-brand-muted">
          When enabled, account title is required, plus either account number or IBAN.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["bankName", "Bank name", false],
              ["accountTitle", "Account title", true],
              ["accountNumber", "Account number", false],
              ["iban", "IBAN", false],
              ["branch", "Branch", false],
            ] as const
          ).map(([key, label, requiredWhenEnabled]) => (
            <div className="field" key={key}>
              <label htmlFor={`bank-${key}`}>
                {label}
                {form.bank.enabled && requiredWhenEnabled ? (
                  <span className="text-red-600"> *</span>
                ) : null}
              </label>
              <input
                id={`bank-${key}`}
                value={form.bank[key]}
                aria-invalid={Boolean(fieldErrors[`bank.${key}`])}
                disabled={!form.bank.enabled}
                onChange={(e) => {
                  setMessage(null);
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next[`bank.${key}`];
                    if (key === "accountNumber" || key === "iban") {
                      delete next["bank.accountNumber"];
                      delete next["bank.iban"];
                    }
                    return next;
                  });
                  setForm({
                    ...form,
                    bank: { ...form.bank, [key]: e.target.value },
                  });
                }}
              />
              <FieldError message={fieldErrors[`bank.${key}`]} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.jazzcash.enabled}
            onChange={(e) => {
              setMessage(null);
              setForm({
                ...form,
                jazzcash: { ...form.jazzcash, enabled: e.target.checked },
              });
            }}
          />
          JazzCash
        </label>
        <p className="text-xs text-brand-muted">
          When enabled, account name and a valid 03XXXXXXXXX mobile are required.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="jc-name">
              Account name
              {form.jazzcash.enabled ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id="jc-name"
              value={form.jazzcash.accountName}
              aria-invalid={Boolean(fieldErrors["jazzcash.accountName"])}
              disabled={!form.jazzcash.enabled}
              onChange={(e) => {
                setMessage(null);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next["jazzcash.accountName"];
                  return next;
                });
                setForm({
                  ...form,
                  jazzcash: { ...form.jazzcash, accountName: e.target.value },
                });
              }}
            />
            <FieldError message={fieldErrors["jazzcash.accountName"]} />
          </div>
          <div className="field">
            <label htmlFor="jc-mobile">
              Mobile number
              {form.jazzcash.enabled ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id="jc-mobile"
              value={form.jazzcash.mobileNumber}
              placeholder="03XXXXXXXXX"
              inputMode="numeric"
              aria-invalid={Boolean(fieldErrors["jazzcash.mobileNumber"])}
              disabled={!form.jazzcash.enabled}
              onChange={(e) => {
                setMessage(null);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next["jazzcash.mobileNumber"];
                  return next;
                });
                setForm({
                  ...form,
                  jazzcash: {
                    ...form.jazzcash,
                    mobileNumber: formatMobile(e.target.value),
                  },
                });
              }}
            />
            <FieldError message={fieldErrors["jazzcash.mobileNumber"]} />
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.easypaisa.enabled}
            onChange={(e) => {
              setMessage(null);
              setForm({
                ...form,
                easypaisa: { ...form.easypaisa, enabled: e.target.checked },
              });
            }}
          />
          EasyPaisa
        </label>
        <p className="text-xs text-brand-muted">
          When enabled, account name and a valid 03XXXXXXXXX mobile are required.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="ep-name">
              Account name
              {form.easypaisa.enabled ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id="ep-name"
              value={form.easypaisa.accountName}
              aria-invalid={Boolean(fieldErrors["easypaisa.accountName"])}
              disabled={!form.easypaisa.enabled}
              onChange={(e) => {
                setMessage(null);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next["easypaisa.accountName"];
                  return next;
                });
                setForm({
                  ...form,
                  easypaisa: {
                    ...form.easypaisa,
                    accountName: e.target.value,
                  },
                });
              }}
            />
            <FieldError message={fieldErrors["easypaisa.accountName"]} />
          </div>
          <div className="field">
            <label htmlFor="ep-mobile">
              Mobile number
              {form.easypaisa.enabled ? <span className="text-red-600"> *</span> : null}
            </label>
            <input
              id="ep-mobile"
              value={form.easypaisa.mobileNumber}
              placeholder="03XXXXXXXXX"
              inputMode="numeric"
              aria-invalid={Boolean(fieldErrors["easypaisa.mobileNumber"])}
              disabled={!form.easypaisa.enabled}
              onChange={(e) => {
                setMessage(null);
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next["easypaisa.mobileNumber"];
                  return next;
                });
                setForm({
                  ...form,
                  easypaisa: {
                    ...form.easypaisa,
                    mobileNumber: formatMobile(e.target.value),
                  },
                });
              }}
            />
            <FieldError message={fieldErrors["easypaisa.mobileNumber"]} />
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <div className="field">
          <label htmlFor="note">Public note (optional)</label>
          <textarea
            id="note"
            rows={3}
            value={form.note}
            onChange={(e) => {
              setMessage(null);
              setForm({ ...form, note: e.target.value });
            }}
          />
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving…" : "Save donate settings"}
        </button>
        {message ? (
          <p className="text-sm font-medium text-brand-green">{message}</p>
        ) : null}
        {error && !message ? (
          <p className="text-sm font-medium text-red-600">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
