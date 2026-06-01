import { redirect } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
} from "@/components/admin/forms/fields";
import {
  getAvailabilityRules,
  getBlockedDates,
  getSettings,
  createAvailabilityRule,
  updateAvailabilityRule,
  deleteAvailabilityRule,
  createBlockedDate,
  deleteBlockedDate,
  updateSettings,
} from "@/actions/settings";
import { siteConfig } from "@/data/content";
import { formatCalendarDateDisplay } from "@/lib/dates";

export default async function AdminSettingsPage() {
  const [rules, blockedDates, settings] = await Promise.all([
    getAvailabilityRules(),
    getBlockedDates(),
    getSettings(),
  ]);

  const site = settings ?? {
    name: siteConfig.name,
    email: siteConfig.email,
    phone: siteConfig.phoneDisplay,
    instagram: siteConfig.instagram,
    location: siteConfig.location,
  };

  async function saveSettingsAction(formData: FormData) {
    "use server";
    await updateSettings(formData);
    redirect("/admin/settings");
  }

  async function addRuleAction(formData: FormData) {
    "use server";
    await createAvailabilityRule(formData);
    redirect("/admin/settings");
  }

  async function addBlockedAction(formData: FormData) {
    "use server";
    await createBlockedDate(formData);
    redirect("/admin/settings");
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader title="Settings" description="Business info, hours, and blocked dates" />

      <form action={saveSettingsAction} className="border border-border bg-background p-6">
        <h2 className="font-serif text-xl">Business Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label="Business Name" name="name" defaultValue={site.name} required />
          <FormField label="Email" name="email" type="email" defaultValue={site.email} required />
          <FormField label="Phone" name="phone" defaultValue={site.phone} required />
          <FormField label="Location" name="location" defaultValue={site.location} required />
          <FormField label="Instagram URL" name="instagram" defaultValue={site.instagram ?? ""} />
        </div>
        <div className="mt-4">
          <SubmitButton label="Save Settings" />
        </div>
      </form>

      <section>
        <h2 className="font-serif text-xl">Working Hours</h2>
        <form action={addRuleAction} className="mt-4 border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SelectField
              label="Day"
              name="dayOfWeek"
              required
              options={[
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY",
              ].map((d) => ({ value: d, label: d }))}
            />
            <FormField label="Start" name="startTime" defaultValue="10:00" required placeholder="10:00" />
            <FormField label="End" name="endTime" defaultValue="19:00" required placeholder="19:00" />
            <CheckboxField label="Active" name="isActive" defaultChecked />
          </div>
          <div className="mt-4">
            <SubmitButton label="Add Rule" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm"
            >
              <span>
                {rule.dayOfWeek}: {rule.startTime} – {rule.endTime}{" "}
                {!rule.isActive && "(inactive)"}
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/settings/availability/${rule.id}/edit`} className="text-xs uppercase text-gold">
                  Edit
                </Link>
                <DeleteButton action={deleteAvailabilityRule.bind(null, rule.id)} label="" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl">Blocked Dates</h2>
        <form action={addBlockedAction} className="mt-4 border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label="Date" name="date" type="date" required />
            <FormField label="Reason" name="reason" placeholder="Vacation" />
            <CheckboxField label="All Day" name="allDay" defaultChecked />
            <FormField label="Start Time" name="startTime" placeholder="10:00" />
            <FormField label="End Time" name="endTime" placeholder="14:00" />
          </div>
          <div className="mt-4">
            <SubmitButton label="Add Blocked Date" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {blockedDates.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm"
            >
              <span>
                {formatCalendarDateDisplay(block.date)} — {block.reason ?? "Blocked"}
                {block.allDay ? " (all day)" : ""}
              </span>
              <DeleteButton action={deleteBlockedDate.bind(null, block.id)} label="" />
            </div>
          ))}
        </div>
      </section>

      <section className="border border-border bg-background p-6">
        <h2 className="font-serif text-xl">Integrations</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Resend: {process.env.RESEND_API_KEY ? "Configured" : "Not configured"}</li>
          <li>Cloudinary: {process.env.CLOUDINARY_CLOUD_NAME ? "Configured" : "Not configured"}</li>
          <li>Google Calendar: {process.env.GOOGLE_CLIENT_ID ? "Configured" : "Not configured"}</li>
        </ul>
      </section>
    </div>
  );
}
