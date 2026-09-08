"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function DiscountsError({ reset }: { reset: () => void }) {
  const t = useTranslations("discounts");
  return (
    <section className="section-padding luxury-container text-center">
      <h1 className="text-3xl">{t("unavailable")}</h1>
      <p className="mt-4 text-muted">{t("unavailableHint")}</p>
      <Button onClick={reset} variant="outline" className="mt-6">{t("retry")}</Button>
    </section>
  );
}
