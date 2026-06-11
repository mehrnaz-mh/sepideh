"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, SelectField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateRuleAction } from "./edit-availability-actions";

const DAY_LABELS: Record<string, { en: string; fa: string }> = {
  MONDAY:    { en: "Monday",    fa: "دوشنبه" },
  TUESDAY:   { en: "Tuesday",   fa: "سه‌شنبه" },
  WEDNESDAY: { en: "Wednesday", fa: "چهارشنبه" },
  THURSDAY:  { en: "Thursday",  fa: "پنج‌شنبه" },
  FRIDAY:    { en: "Friday",    fa: "جمعه" },
  SATURDAY:  { en: "Saturday",  fa: "شنبه" },
  SUNDAY:    { en: "Sunday",    fa: "یکشنبه" },
};

type Rule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

export function EditAvailabilityClient({ rule }: { rule: Rule }) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";

  const dayOptions = Object.entries(DAY_LABELS).map(([value, labels]) => ({
    value,
    label: isRtl ? labels.fa : labels.en,
  }));

  const action = updateRuleAction.bind(null, rule.id);

  return (
    <AdminFormShell titleKey="editWorkingHours" backHref="/admin/settings" action={action}>
      <div className="border border-border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label={t("day")} name="dayOfWeek" defaultValue={rule.dayOfWeek} required options={dayOptions} />
          <FormField label={t("startTime")} name="startTime" defaultValue={rule.startTime} required placeholder="10:00" hint={t("timeHint")} />
          <FormField label={t("endTime")} name="endTime" defaultValue={rule.endTime} required placeholder="19:00" hint={t("timeHint")} />
          <CheckboxField label={t("active")} name="isActive" defaultChecked={rule.isActive} />
        </div>
      </div>
    </AdminFormShell>
  );
}
