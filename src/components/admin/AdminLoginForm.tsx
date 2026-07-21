"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FoundationLogo } from "@/components/site/FoundationLogo";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-cream">
      <div className="w-full max-w-md bg-white border border-brand-green/10 p-8 shadow-sm">
        <div className="flex flex-col items-center text-center gap-4 mb-8">
          <FoundationLogo
            alt="Al Sirat Ul Mustaqeem Foundation"
            size="auth"
            priority
            framed
          />
          <h1 className="font-display text-2xl text-brand-green font-semibold">
            Board Login
          </h1>
          <p className="text-sm text-brand-muted">
            Al Sirat Ul Mustaqeem Foundation
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          {error ? (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
              {error}
            </p>
          ) : null}
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
