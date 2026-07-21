"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function UserForm({
  roles,
}: {
  roles: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setOk(null);
    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") || "").trim().toLowerCase(),
      fullName: String(formData.get("fullName") || "").trim(),
      password: String(formData.get("password") || ""),
      roleId: String(formData.get("roleId") || ""),
    };

    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Failed to create user");
      return;
    }

    setOk(`User ${payload.username} created`);
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-brand-green/10 p-6 grid gap-4 sm:grid-cols-2"
    >
      <h2 className="sm:col-span-2 font-semibold text-brand-green">
        Create user
      </h2>
      {error ? (
        <p className="sm:col-span-2 text-sm text-red-600">{error}</p>
      ) : null}
      {ok ? <p className="sm:col-span-2 text-sm text-brand-green">{ok}</p> : null}
      <div className="field">
        <label htmlFor="username">Username (unique)</label>
        <input id="username" name="username" required minLength={3} />
      </div>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" required minLength={3} />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required minLength={6} />
      </div>
      <div className="field">
        <label htmlFor="roleId">Role</label>
        <select id="roleId" name="roleId" required defaultValue="">
          <option value="" disabled>
            Select role
          </option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create user"}
        </button>
      </div>
    </form>
  );
}
