"use client";

import { useAdminLang } from "@/components/admin/lang-context";

export function T({ k }: { k: string }) {
  const { t } = useAdminLang();
  return <>{t(k)}</>;
}
