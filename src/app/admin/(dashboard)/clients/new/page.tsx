import { redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { createClient } from "@/actions/clients";

export default function NewClientPage() {
  async function action(formData: FormData) {
    "use server";
    const result = await createClient(formData);
    if (!result.success) redirect(`/admin/clients/new?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/clients");
  }

  return (
    <AdminFormShell title="New Client" backHref="/admin/clients" action={action} submitLabel="Create">
      <FormSection title="Client Information">
        <FormField label="First Name" name="firstName" required />
        <FormField label="Last Name" name="lastName" required />
        <FormField label="Email" name="email" type="email" required />
        <FormField label="Phone" name="phone" type="tel" />
        <SelectField
          label="Locale"
          name="locale"
          defaultValue="de"
          options={[
            { value: "de", label: "German" },
            { value: "en", label: "English" },
          ]}
        />
        <FormField label="Tags (comma-separated)" name="tags" placeholder="bridal, vip" />
        <CheckboxField label="VIP Client" name="isVip" />
        <div className="md:col-span-2">
          <TextAreaField label="Notes" name="notes" />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
