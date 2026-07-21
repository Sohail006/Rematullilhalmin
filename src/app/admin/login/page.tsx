import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return <AdminLoginForm />;
}
