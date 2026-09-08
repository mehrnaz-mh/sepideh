"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ExternalLink, MousePointerClick, Plus, TicketPercent, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminLang } from "@/components/admin/lang-context";
import { discountStatus, type DiscountFormValues } from "@/lib/discounts";
import { deleteDiscountOffer } from "@/actions/discounts";

export function DiscountsClient({ offers, today }: { offers: DiscountFormValues[]; today: string }) {
  const { t } = useAdminLang();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t("discounts")}</h1>
          <p className="mt-2 text-sm text-muted">{t("discountsDesc")}</p>
        </div>
        <Button asChild variant="gold">
          <Link href="/admin/discounts/new"><Plus size={16} />{t("discountNew")}</Link>
        </Button>
      </div>
      {offers.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center">
          <TicketPercent size={32} className="mx-auto mb-4 text-muted" />
          <p>{t("discountEmpty")}</p>
          <p className="mt-2 text-sm text-muted">{t("discountEmptyHint")}</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {offers.map((offer) => {
            const status = discountStatus(offer, today);
            return (
              <article key={offer.id} className="min-w-0 border border-border bg-background p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="break-words text-xl">{offer.brandName}</h2>
                  <span className={`rounded-sm px-2 py-1 text-xs ${status === "active" ? "bg-green-50 text-green-800" : "bg-background-secondary text-muted"}`}>
                    {t(status)}
                  </span>
                </div>
                <p className="mt-3 break-words text-sm">{offer.offerDe} / {offer.offerEn}</p>
                <code dir="ltr" className="mt-3 block break-all font-mono">{offer.code}</code>
                <p className="mt-3 text-xs text-muted">
                  {t("discountExpiry")}: {offer.expiresAt ?? t("discountNoExpiry")}
                </p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                  <MousePointerClick size={14} />
                  {t("discountClicks")}: <span className="font-medium text-foreground">{offer.clickCount}</span>
                </p>
                <div className="mt-5 flex flex-wrap items-start gap-5 border-t border-border pt-4">
                  <Link href={`/admin/discounts/${offer.id}/edit`} className="text-sm underline underline-offset-4">{t("edit")}</Link>
                  <a href={offer.url} target="_blank" rel="noopener sponsored" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">
                    {t("discountVisit")}<ExternalLink size={14} />
                  </a>
                  <DeleteOffer id={offer.id} brandName={offer.brandName} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DeleteOffer({ id, brandName }: { id: string; brandName: string }) {
  const { t } = useAdminLang();
  const [state, action, pending] = useActionState(deleteDiscountOffer.bind(null, id), {});
  return (
    <form action={action} onSubmit={(event) => {
      if (!window.confirm(`${t("discountDeleteConfirm")} ${brandName}`)) event.preventDefault();
    }}>
      <button type="submit" disabled={pending} className="inline-flex items-center gap-1 text-sm text-red-700 disabled:opacity-50">
        <Trash2 size={14} />{pending ? "…" : t("delete")}
      </button>
      {state.error && <p role="alert" className="mt-2 text-sm text-red-700">{t(state.error)}</p>}
    </form>
  );
}
