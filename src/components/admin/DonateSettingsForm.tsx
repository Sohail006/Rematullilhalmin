"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { DonateSettings } from "@/lib/constants";

export function DonateSettingsForm({ initial }: { initial: DonateSettings }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/settings/donate", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Save failed");
      return;
    }

    setMessage("Donate settings saved");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-brand-green">{message}</p> : null}

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.bank.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                bank: { ...form.bank, enabled: e.target.checked },
              })
            }
          />
          Bank transfer
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["bankName", "Bank name"],
              ["accountTitle", "Account title"],
              ["accountNumber", "Account number"],
              ["iban", "IBAN"],
              ["branch", "Branch"],
            ] as const
          ).map(([key, label]) => (
            <div className="field" key={key}>
              <label htmlFor={`bank-${key}`}>{label}</label>
              <input
                id={`bank-${key}`}
                value={form.bank[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bank: { ...form.bank, [key]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.jazzcash.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                jazzcash: { ...form.jazzcash, enabled: e.target.checked },
              })
            }
          />
          JazzCash
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="jc-name">Account name</label>
            <input
              id="jc-name"
              value={form.jazzcash.accountName}
              onChange={(e) =>
                setForm({
                  ...form,
                  jazzcash: { ...form.jazzcash, accountName: e.target.value },
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="jc-mobile">Mobile number</label>
            <input
              id="jc-mobile"
              value={form.jazzcash.mobileNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  jazzcash: { ...form.jazzcash, mobileNumber: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <label className="flex items-center gap-2 font-semibold text-brand-green">
          <input
            type="checkbox"
            checked={form.easypaisa.enabled}
            onChange={(e) =>
              setForm({
                ...form,
                easypaisa: { ...form.easypaisa, enabled: e.target.checked },
              })
            }
          />
          EasyPaisa
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="ep-name">Account name</label>
            <input
              id="ep-name"
              value={form.easypaisa.accountName}
              onChange={(e) =>
                setForm({
                  ...form,
                  easypaisa: {
                    ...form.easypaisa,
                    accountName: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="ep-mobile">Mobile number</label>
            <input
              id="ep-mobile"
              value={form.easypaisa.mobileNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  easypaisa: {
                    ...form.easypaisa,
                    mobileNumber: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-green/10 p-6 space-y-4">
        <div className="field">
          <label htmlFor="note">Public note</label>
          <textarea
            id="note"
            rows={3}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </div>
      </section>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save donate settings"}
      </button>
    </form>
  );
}
