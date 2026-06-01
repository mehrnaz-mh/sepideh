"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "sepide-cookie-consent";

export function CookieConsent() {
  const t = useTranslations("cookie");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept(type: "all" | "essential") {
    localStorage.setItem(CONSENT_KEY, type);
    setVisible(false);
    if (type === "all" && typeof window !== "undefined") {
      window.dispatchEvent(new Event("cookie-consent-granted"));
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] border-t border-border bg-background p-4 shadow-lg md:p-6">
      <div className="luxury-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="font-serif text-lg">{t("title")}</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted">{t("description")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" onClick={() => accept("essential")}>
            {t("decline")}
          </Button>
          <Button variant="gold" size="sm" onClick={() => accept("all")}>
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>
  );
}
