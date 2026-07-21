"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactSettings } from "@/lib/constants";

export function ContactSettingsForm({ initial }: { initial: ContactSettings }) {
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

    const response = await fetch("/api/admin/settings/contact", {
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

    setMessage("Contact settings saved");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-brand-green/10 p-6 space-y-4">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-brand-green">{message}</p> : null}
      {(
        [
          ["phone", "Phone"],
          ["whatsapp", "WhatsApp"],
          ["email", "Email"],
          ["officeHours", "Office hours"],
        ] as const
      ).map(([key, label]) => (
        <div className="field" key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          />
        </div>
      ))}
      <div className="field">
        <label htmlFor="address">Address</label>
        <textarea
          id="address"
          rows={3}
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
