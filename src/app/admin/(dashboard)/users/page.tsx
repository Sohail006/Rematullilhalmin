import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { UserForm } from "@/components/admin/UserForm";
import { UserToggle } from "@/components/admin/UserToggle";

export default async function UsersPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, "users.manage")) {
    redirect("/admin");
  }

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.role.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          Board users
        </h1>
        <p className="text-brand-muted mt-1">
          Create directors and staff with unique usernames
        </p>
      </div>

      <UserForm roles={roles.map((r) => ({ id: r.id, name: r.name }))} />

      <div className="overflow-x-auto bg-white border border-brand-green/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-brand-cream text-brand-muted">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Full name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-brand-green/10">
                <td className="px-4 py-3 font-mono">{user.username}</td>
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3">{user.role.name}</td>
                <td className="px-4 py-3">
                  <UserToggle
                    userId={user.id}
                    username={user.username}
                    isActive={user.isActive}
                    isSelf={user.id === session.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
