"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserToggle({
  userId,
  username,
  isActive,
  isSelf,
}: {
  userId: string;
  username: string;
  isActive: boolean;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (isSelf && isActive) {
      alert("You cannot deactivate your own account.");
      return;
    }
    if (
      !confirm(
        `${isActive ? "Deactivate" : "Activate"} user "${username}"?`,
      )
    ) {
      return;
    }

    setLoading(true);
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || "Update failed");
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading || (isSelf && isActive)}
      className={`rounded px-2.5 py-1 text-xs font-semibold ${
        isActive
          ? "bg-brand-green-soft text-brand-green hover:bg-brand-green/20"
          : "bg-red-50 text-red-700 hover:bg-red-100"
      } disabled:opacity-50`}
    >
      {loading ? "..." : isActive ? "Active" : "Inactive"}
    </button>
  );
}
