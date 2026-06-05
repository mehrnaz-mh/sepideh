import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { getClient, updateClient } from "@/actions/clients";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  async function action(formData: FormData) {
    "use server";
    const result = await updateClient(id, formData);
    if (!result.success) redirect(`/admin/clients/${id}/edit?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/clients?success=updated");
  }

  return (
    <AdminFormShell title="Edit Client" backHref="/admin/clients" action={action}>
      <FormSection title="Client Information">
        <FormField label="First Name" name="firstName" defaultValue={client.firstName} required />
        <FormField label="Last Name" name="lastName" defaultValue={client.lastName} required />
        <FormField label="Email" name="email" type="email" defaultValue={client.email} required />
        <FormField label="Phone" name="phone" type="tel" defaultValue={client.phone ?? ""} />
        <SelectField
          label="Locale"
          name="locale"
          defaultValue={client.locale}
          options={[
            { value: "de", label: "German" },
            { value: "en", label: "English" },
          ]}
        />
        <FormField label="Tags" name="tags" defaultValue={client.tags.join(", ")} />
        <CheckboxField label="VIP Client" name="isVip" defaultChecked={client.isVip} />
        <div className="md:col-span-2">
          <TextAreaField label="Notes" name="notes" defaultValue={client.notes ?? ""} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
