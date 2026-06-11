import { getAvailabilityRules, getBlockedDates, getSettings } from "@/actions/settings";
import { siteConfig } from "@/data/content";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const [rules, blockedDates, settings] = await Promise.all([
    getAvailabilityRules(),
    getBlockedDates(),
    getSettings(),
  ]);

  const site = (settings as { name: string; email: string; phone: string; location: string; instagram?: string } | null) ?? {
    name: siteConfig.name,
    email: siteConfig.email,
    phone: siteConfig.phoneDisplay,
    instagram: siteConfig.instagram,
    location: siteConfig.location,
  };

  return <SettingsClient rules={rules} blockedDates={blockedDates} site={site} />;
}
