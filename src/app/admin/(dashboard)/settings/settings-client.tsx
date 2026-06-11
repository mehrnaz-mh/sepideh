"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { CheckboxField, FormField, SelectField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import {
  saveSettingsAction,
  addRuleAction,
  addBlockedAction,
  deleteAvailabilityRule,
  deleteBlockedDate,
} from "./settings-actions";

type Rule = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type BlockedDate = {
  id: string;
  date: Date;
  reason?: string | null;
  allDay: boolean;
};

type SiteSettings = {
  name: string;
  email: string;
  phone: string;
  location: string;
  instagram?: string | null;
};

const DAY_LABELS: Record<string, { en: string; fa: string }> = {
  MONDAY:    { en: "Monday",    fa: "دوشنبه" },
  TUESDAY:   { en: "Tuesday",   fa: "سه‌شنبه" },
  WEDNESDAY: { en: "Wednesday", fa: "چهارشنبه" },
  THURSDAY:  { en: "Thursday",  fa: "پنج‌شنبه" },
  FRIDAY:    { en: "Friday",    fa: "جمعه" },
  SATURDAY:  { en: "Saturday",  fa: "شنبه" },
  SUNDAY:    { en: "Sunday",    fa: "یکشنبه" },
};

export function SettingsClient({
  rules,
  blockedDates,
  site,
}: {
  rules: Rule[];
  blockedDates: BlockedDate[];
  site: SiteSettings;
}) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";

  const dayOptions = Object.entries(DAY_LABELS).map(([value, labels]) => ({
    value,
    label: isRtl ? labels.fa : labels.en,
  }));

  function formatDate(date: Date) {
    return new Date(date).toLocaleDateString(isRtl ? "fa-IR" : "de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader titleKey="settings" descriptionKey="settingsDesc" />

      {/* Business Info */}
      <form action={saveSettingsAction} className="border border-border bg-background p-6">
        <h2 className="text-xl mb-4">{t("businessInfo")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("businessName")} name="name" defaultValue={site.name} required />
          <FormField label={t("email")} name="email" type="email" defaultValue={site.email} required />
          <FormField label={t("phone")} name="phone" defaultValue={site.phone} required />
          <FormField label={t("location")} name="location" defaultValue={site.location} required />
          <FormField label={t("instagramUrl")} name="instagram" defaultValue={site.instagram ?? ""} />
        </div>
        <div className="mt-4">
          <SubmitButton labelKey="saveSettings" />
        </div>
      </form>

      {/* Working Hours */}
      <section>
        <h2 className="text-xl mb-4">{t("workingHours")}</h2>
        <form action={addRuleAction} className="border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SelectField label={t("day")} name="dayOfWeek" required options={dayOptions} />
            <FormField label={t("startTime")} name="startTime" defaultValue="10:00" required placeholder="10:00" hint={t("timeHint")} />
            <FormField label={t("endTime")} name="endTime" defaultValue="19:00" required placeholder="19:00" hint={t("timeHint")} />
            <CheckboxField label={t("active")} name="isActive" defaultChecked />
          </div>
          <div className="mt-4">
            <SubmitButton labelKey="addRule" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {rules.map((rule) => {
            const dayLabel = isRtl ? DAY_LABELS[rule.dayOfWeek]?.fa : DAY_LABELS[rule.dayOfWeek]?.en;
            return (
              <div
                key={rule.id}
                className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm"
              >
                <span>
                  {dayLabel ?? rule.dayOfWeek}: {rule.startTime} – {rule.endTime}
                  {!rule.isActive && <span className="ms-2 text-muted">({t("inactive")})</span>}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/settings/availability/${rule.id}/edit`}
                    className="text-muted hover:text-gold transition-colors leading-none"
                    title={t("edit")}
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton action={deleteAvailabilityRule.bind(null, rule.id)} label="" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blocked Dates */}
      <section>
        <h2 className="text-xl mb-4">{t("blockedDates")}</h2>
        <form action={addBlockedAction} className="border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("date")} name="date" type="date" required />
            <FormField label={t("reason")} name="reason" placeholder={isRtl ? "تعطیلی" : "Vacation"} />
            <CheckboxField label={t("allDay")} name="allDay" defaultChecked />
            <FormField label={t("startTime")} name="startTime" placeholder="10:00" />
            <FormField label={t("endTime")} name="endTime" placeholder="14:00" />
          </div>
          <div className="mt-4">
            <SubmitButton labelKey="addBlockedDate" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {blockedDates.map((block) => (
            <div
              key={block.id}
              className="flex items-center justify-between border border-border bg-background px-4 py-3 text-sm"
            >
              <span>
                {formatDate(block.date)} — {block.reason ?? (isRtl ? "مسدود" : "Blocked")}
                {block.allDay && <span className="ms-2 text-muted">({isRtl ? "تمام روز" : "all day"})</span>}
              </span>
              <DeleteButton action={deleteBlockedDate.bind(null, block.id)} label="" />
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section className="border border-border bg-background p-6">
        <h2 className="text-xl mb-4">{t("integrations")}</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>Resend: {process.env.RESEND_API_KEY ? (isRtl ? "پیکربندی شده" : "Configured") : (isRtl ? "پیکربندی نشده" : "Not configured")}</li>
          <li>Cloudinary: {process.env.CLOUDINARY_CLOUD_NAME ? (isRtl ? "پیکربندی شده" : "Configured") : (isRtl ? "پیکربندی نشده" : "Not configured")}</li>
          <li>Google Calendar: {process.env.GOOGLE_CLIENT_ID ? (isRtl ? "پیکربندی شده" : "Configured") : (isRtl ? "پیکربندی نشده" : "Not configured")}</li>
        </ul>
      </section>
    </div>
  );
}
