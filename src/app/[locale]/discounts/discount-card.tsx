"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type PublicOffer = {
  id: string;
  brandName: string;
  logoUrl: string | null;
  discountLabel: string | null;
  code: string;
  url: string;
  title: string;
  expiresAt: string | null;
};

export function DiscountCard({ offer }: { offer: PublicOffer }) {
  const t = useTranslations("discounts");
  const locale = useLocale();
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [copying, setCopying] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (copyState !== "copied") return;
    const timeout = window.setTimeout(() => setCopyState("idle"), 3000);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  async function copyCode() {
    setCopying(true);
    setCopyState("idle");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(offer.code);
      } else if (!copyWithLegacyClipboard(offer.code)) {
        throw new Error("Clipboard unavailable");
      }
      setCopyState("copied");
    } catch {
      // Keep the visible code selected for manual copying when clipboard access is denied.
      if (codeRef.current) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setCopyState("failed");
    } finally {
      setCopying(false);
    }
  }

  const expiry = offer.expiresAt ? new Intl.DateTimeFormat(locale, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${offer.expiresAt}T00:00:00Z`)) : null;

  return (
    <article className="group flex w-full max-w-[390px] min-w-0 flex-col justify-self-center rounded-lg border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_18px_45px_-28px_rgba(47,52,40,0.45)] sm:p-7">
      <div className="min-w-0">
        <div className="mb-6 flex min-h-14 items-center justify-between gap-4">
          {offer.logoUrl ? (
            <Image
              src={offer.logoUrl}
              alt={`${offer.brandName} logo`}
              width={120}
              height={56}
              className="h-14 w-auto max-w-[140px] object-contain object-left"
              style={{ width: "auto", height: "auto" }}
            />
          ) : (
            <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-full border border-beige-soft bg-background-secondary text-xl text-gold">
              {offer.brandName.trim().charAt(0).toUpperCase()}
            </span>
          )}
          {offer.discountLabel && (
            <span className="shrink-0 rounded-full bg-gold px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-white">
              {offer.discountLabel}
            </span>
          )}
        </div>
        <h2 className="break-words text-2xl leading-tight transition-colors group-hover:text-gold md:text-3xl">
          {offer.brandName}
        </h2>
        <p className="mt-3 break-words text-lg leading-relaxed text-muted">{offer.title}</p>
        {expiry && <p className="mt-3 text-xs text-muted">{t("validUntil", { date: expiry })}</p>}
      </div>
      <div className="mt-auto min-w-0 pt-7">
        <div className="rounded-lg border border-beige-soft bg-background-secondary px-5 py-4">
          <p className="mb-2 text-xs text-muted">{t("codeLabel")}</p>
          <code ref={codeRef} dir="ltr" className="block select-all break-all font-mono text-lg tracking-wider">{offer.code}</code>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
          <Button type="button" variant="outline" className="w-full" disabled={copying} onClick={copyCode} aria-label={t("copyFor", { brand: offer.brandName })}>
            {copyState === "copied" ? <Check size={16} /> : <Copy size={16} />}
            {copyState === "copied" ? t("copied") : t("copy")}
          </Button>
          <Button asChild variant="gold" className="w-full text-center">
            <a href={`/api/discounts/${offer.id}/visit`} target="_blank" rel="sponsored nofollow noopener" aria-label={t("shopAt", { brand: offer.brandName })}>
              <span>{t("visit")}</span>
            </a>
          </Button>
        </div>
        <p role="status" aria-live="polite" className="mt-3 text-xs leading-relaxed text-muted">
          {copyState === "failed" ? t("copyFailed") : copyState === "copied" ? t("copiedHint") : ""}
        </p>
      </div>
    </article>
  );
}

function copyWithLegacyClipboard(value: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.readOnly = true;
  textarea.setAttribute("aria-hidden", "true");
  Object.assign(textarea.style, {
    position: "fixed",
    insetInlineStart: "-9999px",
    top: "0",
    opacity: "0",
    fontSize: "16px",
  });
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, value.length);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}
