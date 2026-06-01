"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FadeIn } from "@/components/motion/fade-in";
import { services } from "@/data/content";
import type { Locale } from "@/data/content";
import {
  createBooking,
  getAvailableDatesAction,
  getAvailableSlotsAction,
} from "@/actions/booking";
import { format, addDays, parse, startOfDay } from "date-fns";
import { de, enGB } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BookingPage() {
  const t = useTranslations("booking");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState(
    searchParams.get("service") || "",
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedService = services.find((s) => s.slug === serviceSlug);
  const dateLocale = locale === "de" ? de : enGB;

  const upcomingDates = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) =>
        format(addDays(startOfDay(new Date()), i + 1), "yyyy-MM-dd"),
      ),
    [],
  );

  useEffect(() => {
    if (step === 1 && serviceSlug) {
      setLoadingDates(true);
      getAvailableDatesAction(serviceSlug, upcomingDates)
        .then((dates) => setAvailableDates(new Set(dates)))
        .catch(() => setAvailableDates(new Set()))
        .finally(() => setLoadingDates(false));
    }
  }, [step, serviceSlug, upcomingDates]);

  useEffect(() => {
    if (date && availableDates.size > 0 && !availableDates.has(date)) {
      setDate("");
    }
  }, [availableDates, date]);

  useEffect(() => {
    if (date && serviceSlug) {
      setLoadingSlots(true);
      getAvailableSlotsAction(date, serviceSlug)
        .then(setSlots)
        .catch(() => setSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [date, serviceSlug]);

  function nextStep() {
    setError("");
    if (step < 3) setStep(step + 1);
  }

  function prevStep() {
    setError("");
    if (step > 0) setStep(step - 1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("serviceSlug", serviceSlug);
    formData.set("date", date);
    formData.set("time", time);
    formData.set("locale", locale);

    startTransition(async () => {
      const result = await createBooking(formData);
      if (result.success) {
        router.push(`/booking/confirm?id=${result.appointmentId}`);
      } else {
        setError(result.error || tc("error"));
      }
    });
  }

  return (
    <>
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container max-w-3xl">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="font-serif text-5xl">{t("title")}</h1>
            <p className="mt-4 text-muted">{t("subtitle")}</p>
          </FadeIn>

          <div className="mt-10 flex gap-2">
            {[t("stepService"), t("stepDate"), t("stepTime"), t("stepDetails")].map(
              (label, i) => (
                <div
                  key={label}
                  className={`flex-1 border-b-2 pb-2 text-center text-xs uppercase tracking-widest ${
                    i <= step ? "border-gold text-gold" : "border-border text-muted"
                  }`}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container max-w-3xl">
          {error && (
            <p className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {step === 0 && (
            <FadeIn>
              <h2 className="font-serif text-2xl">{t("selectService")}</h2>
              <div className="mt-6 grid gap-4">
                {services.map((service) => (
                  <button
                    key={service.slug}
                    type="button"
                    onClick={() => setServiceSlug(service.slug)}
                    className={`border p-6 text-left transition-colors ${
                      serviceSlug === service.slug
                        ? "border-gold bg-background-secondary"
                        : "border-border hover:border-gold"
                    }`}
                  >
                    <p className="font-serif text-xl">{service[locale].title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {service.durationMinutes} {tc("minutes")}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button variant="gold" onClick={nextStep} disabled={!serviceSlug}>
                  {tc("next")} <ChevronRight size={16} />
                </Button>
              </div>
            </FadeIn>
          )}

          {step === 1 && (
            <FadeIn>
              <h2 className="font-serif text-2xl">{t("selectDate")}</h2>
              {loadingDates ? (
                <p className="mt-6 text-muted">{t("loadingDates")}</p>
              ) : (
                <>
                  <div className="mt-4 flex flex-wrap gap-6 text-xs uppercase tracking-widest text-muted">
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 border border-gold bg-background" />
                      {t("dateAvailable")}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 border border-border bg-background-secondary opacity-60" />
                      {t("dateUnavailable")}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {upcomingDates.map((d) => {
                      const isAvailable = availableDates.has(d);
                      const isSelected = date === d;

                      return (
                        <button
                          key={d}
                          type="button"
                          disabled={!isAvailable}
                          aria-disabled={!isAvailable}
                          onClick={() => {
                            if (!isAvailable) return;
                            setDate(d);
                            setTime("");
                          }}
                          className={`border p-3 text-center text-sm transition-colors ${
                            isSelected
                              ? "border-gold bg-gold text-white"
                              : isAvailable
                                ? "border-gold/40 bg-background hover:border-gold"
                                : "cursor-not-allowed border-border bg-background-secondary text-muted opacity-50"
                          }`}
                        >
                          {format(parse(d, "yyyy-MM-dd", new Date()), "EEE", {
                            locale: dateLocale,
                          })}
                          <br />
                          {format(parse(d, "yyyy-MM-dd", new Date()), "d MMM", {
                            locale: dateLocale,
                          })}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft size={16} /> {tc("back")}
                </Button>
                <Button
                  variant="gold"
                  onClick={nextStep}
                  disabled={!date || !availableDates.has(date)}
                >
                  {tc("next")} <ChevronRight size={16} />
                </Button>
              </div>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn>
              <h2 className="font-serif text-2xl">{t("selectTime")}</h2>
              {loadingSlots ? (
                <p className="mt-6 text-muted">{tc("loading")}</p>
              ) : slots.length === 0 ? (
                <p className="mt-6 text-muted">{t("noSlots")}</p>
              ) : (
                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`border p-3 text-sm transition-colors ${
                        time === slot
                          ? "border-gold bg-gold text-white"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft size={16} /> {tc("back")}
                </Button>
                <Button variant="gold" onClick={nextStep} disabled={!time}>
                  {tc("next")} <ChevronRight size={16} />
                </Button>
              </div>
            </FadeIn>
          )}

          {step === 3 && selectedService && (
            <FadeIn>
              <h2 className="font-serif text-2xl">{t("yourDetails")}</h2>
              <div className="mt-6 border border-border bg-background-secondary p-6">
                <h3 className="text-xs uppercase tracking-widest text-muted">
                  {t("summary")}
                </h3>
                <p className="mt-2 font-serif text-xl">
                  {selectedService[locale].title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {format(new Date(date), "PPP", { locale: dateLocale })} · {time}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">{t("firstName")}</Label>
                    <Input id="firstName" name="firstName" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t("lastName")}</Label>
                    <Input id="lastName" name="lastName" required className="mt-2" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" name="email" type="email" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="phone">{t("phone")}</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="notes">{t("notes")}</Label>
                  <Textarea id="notes" name="notes" className="mt-2" />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft size={16} /> {tc("back")}
                  </Button>
                  <Button type="submit" variant="gold" disabled={isPending}>
                    {isPending ? tc("loading") : t("confirmBooking")}
                  </Button>
                </div>
              </form>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}
