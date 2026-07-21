import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RolePermissionsForm } from "@/components/admin/RolePermissionsForm";

export default async function RolesPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, "roles.manage")) {
    redirect("/admin");
  }

  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      include: {
        permissions: true,
        _count: { select: { users: true } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.permission.findMany({ orderBy: { key: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          Roles & permissions
        </h1>
        <p className="text-brand-muted mt-1">
          Assign permissions to roles. Users inherit access from their role.
        </p>
      </div>

      <RolePermissionsForm
        roles={roles.map((role) => ({
          id: role.id,
          name: role.name,
          isSystem: role.isSystem,
          userCount: role._count.users,
          permissionIds: role.permissions.map((p) => p.permissionId),
        }))}
        permissions={permissions.map((p) => ({
          id: p.id,
          key: p.key,
          label: p.label,
          description: p.description,
        }))}
      />
    </div>
  );
}
