import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { siteConfig } from "@/data/content";

export const routing = defineRouting({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
