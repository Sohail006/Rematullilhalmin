import { redirect } from "next/navigation";
import { getSession, hasPermission } from "@/lib/auth";
import { getDonateSettings } from "@/lib/settings";
import { DonateSettingsForm } from "@/components/admin/DonateSettingsForm";

export default async function DonateSettingsPage() {
  const session = await getSession();
  if (!session || !hasPermission(session, "settings.donate")) {
    redirect("/admin");
  }

  const donate = await getDonateSettings();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-semibold text-brand-green">
          Donate settings
        </h1>
        <p className="text-brand-muted mt-1">
          Configure bank, JazzCash, and EasyPaisa shown on the public Donate page.
        </p>
      </div>
      <DonateSettingsForm initial={donate} />
    </div>
  );
}
