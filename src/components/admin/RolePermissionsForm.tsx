"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type RoleRow = {
  id: string;
  name: string;
  isSystem: boolean;
  userCount: number;
  permissionIds: string[];
};

type PermissionRow = {
  id: string;
  key: string;
  label: string;
  description: string | null;
};

export function RolePermissionsForm({
  roles,
  permissions,
}: {
  roles: RoleRow[];
  permissions: PermissionRow[];
}) {
  const router = useRouter();
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0]?.id || "");
  const [checked, setChecked] = useState<string[]>(
    roles[0]?.permissionIds || [],
  );
  const [newRoleName, setNewRoleName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId),
    [roles, selectedRoleId],
  );

  function selectRole(roleId: string) {
    setSelectedRoleId(roleId);
    const role = roles.find((r) => r.id === roleId);
    setChecked(role?.permissionIds || []);
    setMessage(null);
    setError(null);
  }

  async function savePermissions(event: FormEvent) {
    event.preventDefault();
    if (!selectedRoleId) return;
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/roles/${selectedRoleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissionIds: checked }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Failed to save");
      return;
    }

    setMessage("Permissions saved");
    router.refresh();
  }

  async function createRole(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoleName }),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Failed to create role");
      return;
    }

    setNewRoleName("");
    setMessage("Role created");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="bg-white border border-brand-green/10 p-4 space-y-2">
        <p className="text-xs font-semibold uppercase text-brand-muted">Roles</p>
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => selectRole(role.id)}
            className={`w-full text-left rounded px-3 py-2 text-sm ${
              selectedRoleId === role.id
                ? "bg-brand-green text-white"
                : "hover:bg-brand-green-soft"
            }`}
          >
            <span className="font-medium">{role.name}</span>
            <span className="block text-xs opacity-80">
              {role.userCount} user(s)
            </span>
          </button>
        ))}

        <form onSubmit={createRole} className="pt-4 space-y-2 border-t border-brand-green/10">
          <input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="New role name"
            className="w-full border border-brand-green/20 rounded px-3 py-2 text-sm"
            required
            minLength={2}
          />
          <button type="submit" className="btn-outline w-full text-sm py-2" disabled={loading}>
            Add role
          </button>
        </form>
      </div>

      <form
        onSubmit={savePermissions}
        className="bg-white border border-brand-green/10 p-6 space-y-4"
      >
        <div>
          <h2 className="font-semibold text-brand-green text-lg">
            {selectedRole?.name || "Select a role"}
          </h2>
          {selectedRole?.name === "Admin" ? (
            <p className="text-sm text-brand-muted mt-1">
              Admin always keeps all permissions.
            </p>
          ) : null}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {message ? <p className="text-sm text-brand-green">{message}</p> : null}

        <div className="space-y-3">
          {permissions.map((permission) => {
            const isChecked = checked.includes(permission.id);
            const lockAdmin =
              selectedRole?.name === "Admin" && selectedRole.isSystem;
            return (
              <label
                key={permission.id}
                className="flex items-start gap-3 border border-brand-green/10 rounded p-3"
              >
                <input
                  type="checkbox"
                  checked={isChecked || lockAdmin}
                  disabled={lockAdmin}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setChecked((prev) => [...prev, permission.id]);
                    } else {
                      setChecked((prev) =>
                        prev.filter((id) => id !== permission.id),
                      );
                    }
                  }}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium block">{permission.label}</span>
                  <span className="text-xs text-brand-muted font-mono">
                    {permission.key}
                  </span>
                  {permission.description ? (
                    <span className="block text-sm text-brand-muted mt-1">
                      {permission.description}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          })}
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !selectedRoleId}>
          {loading ? "Saving..." : "Save permissions"}
        </button>
      </form>
    </div>
  );
}
