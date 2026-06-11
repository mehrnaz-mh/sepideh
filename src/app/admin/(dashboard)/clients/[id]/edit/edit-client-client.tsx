"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, FormSection, SelectField, TextAreaField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateClientAction } from "./edit-client-actions";

type ClientData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  locale: string;
  tags: string[];
  isVip: boolean;
  notes: string | null;
};

export function EditClientClient({ id, client }: { id: string; client: ClientData }) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";

  const localeOptions = [
    { value: "de", label: isRtl ? "آلمانی" : "German" },
    { value: "en", label: isRtl ? "انگلیسی" : "English" },
  ];

  const action = updateClientAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editClient" backHref="/admin/clients" action={action}>
      <FormSection title={t("clientInfo")}>
        <FormField label={t("firstName")} name="firstName" defaultValue={client.firstName} required />
        <FormField label={t("lastName")} name="lastName" defaultValue={client.lastName} required />
        <FormField label={t("email")} name="email" type="email" defaultValue={client.email} required />
        <FormField label={t("phone")} name="phone" type="tel" defaultValue={client.phone ?? ""} />
        <SelectField label={t("locale")} name="locale" defaultValue={client.locale} options={localeOptions} />
        <FormField label={t("tags")} name="tags" defaultValue={client.tags.join(", ")} />
        <CheckboxField label={t("vipClient")} name="isVip" defaultChecked={client.isVip} />
        <div className="md:col-span-2">
          <TextAreaField label={t("notes")} name="notes" defaultValue={client.notes ?? ""} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
