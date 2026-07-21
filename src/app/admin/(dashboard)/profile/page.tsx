import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          My profile
        </h1>
        <p className="text-brand-muted mt-1">
          {session.fullName} · @{session.username} · {session.roleName}
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
