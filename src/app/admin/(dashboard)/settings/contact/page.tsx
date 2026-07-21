import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { getContactSettings } from "@/lib/settings";
import { ContactSettingsForm } from "@/components/admin/ContactSettingsForm";

export default async function ContactSettingsPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, "settings.contact")) {
    redirect("/admin");
  }

  const contact = await getContactSettings();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          Contact settings
        </h1>
        <p className="text-brand-muted mt-1">
          These details appear on the public Contact page.
        </p>
      </div>
      <ContactSettingsForm initial={contact} />
    </div>
  );
}
