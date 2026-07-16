import { getSiteSettings } from "@/lib/db/queries";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export default async function AdminSitePage() {
  const site = getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-ink">Site Settings</h1>
      <SiteSettingsForm initial={site} />
    </div>
  );
}
