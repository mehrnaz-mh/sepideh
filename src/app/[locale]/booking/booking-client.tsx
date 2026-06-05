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
import { ChevronLeft, ChevronRight, Sparkles, Star, Scissors, Wand2, Camera, Drama, Crown, CalendarHeart, Gem, MessageSquare, Waves } from "lucide-react";
import { siteConfig } from "@/data/content";

export default function BookingPage() {
  const t = useTranslations("booking");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";
  const [step, setStep] = useState(preselectedService ? 1 : 0);
  const [serviceSlug, setServiceSlug] = useState(preselectedService);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState("");
  const [agbChecked, setAgbChecked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selectedService = services.find((s) => s.slug === serviceSlug);

  const serviceIcons: Record<string, React.ReactNode> = {
    "bridal-hair": <Sparkles size={20} />,
    "bridal-makeup": <Star size={20} />,
    "hair-styling": <Scissors size={20} />,
    "makeup": <Wand2 size={20} />,
    "editorial-styling": <Camera size={20} />,
    "fashion-styling": <Drama size={20} />,
    "red-carpet": <Crown size={20} />,
    "event-styling": <CalendarHeart size={20} />,
    "hair-extensions": <Waves size={20} />,
    "vip-services": <Gem size={20} />,
    "consultation": <MessageSquare size={20} />,
  };
  const dateLocale = locale === "de" ? de : enGB;

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const upcomingDates = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 365 }, (_, i) =>
      format(addDays(today, i + 1), "yyyy-MM-dd"),
    );
  }, []);

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
      <div className="mt-10 flex gap-2">
        {[t("stepService"), t("stepDate"), t("stepTime"), t("stepDetails")].map(
          (label, i) => (
            <div
              key={label}
              className={`flex-1 border-b-2 pb-2 text-center text-xs uppercase tracking-widest ${
                i <= step ? "border-beige-soft text-beige-soft" : "border-beige-soft/40 text-beige-soft/40"
              }`}
            >
              {label}
            </div>
          ),
        )}
      </div>

      <section className="section-padding">
        <div className="luxury-container max-w-3xl">
          {error && (
            <p className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {step === 0 && (
            <FadeIn>
              <h2 className="text-2xl">{t("selectService")}</h2>

              {/* Main services grid */}
              <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {services
                  .filter((s) => s.slug !== "vip-services")
                  .map((service) => (
                    <button
                      key={service.slug}
                      type="button"
                      onClick={() => setServiceSlug(service.slug)}
                      className={`flex flex-col items-center justify-center gap-2 border p-4 py-6 text-center sm:flex-row sm:justify-start sm:text-center sm:gap-3 sm:px-5 sm:py-8 transition-all ${
                        serviceSlug === service.slug
                          ? "border-gold bg-background-secondary"
                          : "border-border hover:border-gold"
                      }`}
                    >
                      <span className={`shrink-0 ${serviceSlug === service.slug ? "text-gold" : "text-muted"}`}>
                        {serviceIcons[service.slug]}
                      </span>
                      <p className={`text-xs leading-tight sm:text-base sm:leading-snug ${serviceSlug === service.slug ? "text-gold" : "text-foreground"}`}>
                        {service[locale].title}
                      </p>
                    </button>
                  ))}

                {/* VIP — inside grid, spans 2 cols */}
                <div className="col-span-2 border border-border bg-background-secondary px-4 py-8 flex flex-col items-center justify-center gap-1 text-center">
                  <Gem size={20} className="shrink-0 text-muted" />
                  <div>
                    <p className="text-sm font-medium sm:text-base">VIP Services</p>
                    <p className="text-xs text-muted mt-0.5 sm:text-sm">
                      {locale === "de" ? "Direkt: " : "Contact: "}
                      <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">WhatsApp</a>
                      {" · "}
                      <a href={`mailto:${siteConfig.email}`} className="underline hover:text-gold break-all">email</a>
                    </p>
                  </div>
                </div>
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
              <h2 className="text-2xl">{t("selectDate")}</h2>
              {loadingDates ? (
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-2xl animate-pulse">
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-8 w-8 rounded bg-border" />
                      <div className="flex gap-2">
                        <div className="h-8 w-24 rounded bg-border" />
                        <div className="h-8 w-16 rounded bg-border" />
                      </div>
                      <div className="h-8 w-8 rounded bg-border" />
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="h-6 rounded bg-border" />
                      ))}
                    </div>
                    {Array.from({ length: 5 }).map((_, row) => (
                      <div key={row} className="grid grid-cols-7 gap-0.5 mb-0.5">
                        {Array.from({ length: 7 }).map((_, col) => (
                          <div key={col} className="h-10 rounded bg-border opacity-70" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Calendar header */}
                  <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                      className="border border-border p-2 hover:border-gold transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center gap-2">
                      {/* Month selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowMonthPicker(v => !v); setShowYearPicker(false); }}
                          className="border border-border bg-background px-3 py-1.5 text-xs uppercase tracking-widest hover:border-gold transition-colors flex items-center gap-1"
                        >
                          {(locale === "de"
                            ? ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]
                            : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
                          )[calendarMonth.getMonth()]}
                          <ChevronRight size={10} className="rotate-90 text-muted" />
                        </button>
                        {showMonthPicker && (
                          <div className="absolute top-full left-0 z-50 mt-1 border border-border bg-background shadow-lg">
                            {(locale === "de"
                              ? ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]
                              : ["January","February","March","April","May","June","July","August","September","October","November","December"]
                            ).map((m, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => { setCalendarMonth(cm => new Date(cm.getFullYear(), i, 1)); setShowMonthPicker(false); }}
                                className={`block w-full px-4 py-2 text-left text-xs uppercase tracking-widest hover:bg-background-secondary hover:text-gold transition-colors ${calendarMonth.getMonth() === i ? "text-gold" : "text-foreground"}`}
                              >
                                {m}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Year selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => { setShowYearPicker(v => !v); setShowMonthPicker(false); }}
                          className="border border-border bg-background px-3 py-1.5 text-xs uppercase tracking-widest hover:border-gold transition-colors flex items-center gap-1"
                        >
                          {calendarMonth.getFullYear()}
                          <ChevronRight size={10} className="rotate-90 text-muted" />
                        </button>
                        {showYearPicker && (
                          <div className="absolute top-full left-0 z-50 mt-1 border border-border bg-background shadow-lg">
                            {Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i).map(y => (
                              <button
                                key={y}
                                type="button"
                                onClick={() => { setCalendarMonth(m => new Date(y, m.getMonth(), 1)); setShowYearPicker(false); }}
                                className={`block w-full px-4 py-2 text-left text-xs uppercase tracking-widest hover:bg-background-secondary hover:text-gold transition-colors ${calendarMonth.getFullYear() === y ? "text-gold" : "text-foreground"}`}
                              >
                                {y}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                      className="border border-border p-2 hover:border-gold transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Day labels */}
                  <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-widest text-muted">
                    {(locale === "de"
                      ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
                      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                    ).map((day) => (
                      <div key={day} className="py-1">{day}</div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="mt-1 grid grid-cols-7 gap-0.5">
                    {(() => {
                      const year = calendarMonth.getFullYear();
                      const month = calendarMonth.getMonth();
                      const firstDay = new Date(year, month, 1);
                      // Mon=0 ... Sun=6
                      const startOffset = (firstDay.getDay() + 6) % 7;
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      const cells = [];

                      // Empty cells before first day
                      for (let i = 0; i < startOffset; i++) {
                        cells.push(<div key={`empty-${i}`} />);
                      }

                      for (let day = 1; day <= daysInMonth; day++) {
                        const d = format(new Date(year, month, day), "yyyy-MM-dd");
                        const isAvailable = availableDates.has(d);
                        const isSelected = date === d;
                        const isPast = new Date(year, month, day) <= new Date();

                        cells.push(
                          <button
                            key={d}
                            type="button"
                            disabled={!isAvailable || isPast}
                            onClick={() => {
                              if (!isAvailable || isPast) return;
                              setDate(d);
                              setTime("");
                            }}
                            className={`flex items-center justify-center p-3 text-sm transition-colors ${
                              isSelected
                                ? "border border-gold bg-gold text-white"
                                : isAvailable && !isPast
                                  ? "border border-gold/40 bg-background-secondary hover:border-gold"
                                  : "cursor-not-allowed text-muted opacity-30"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                      return cells;
                    })()}
                  </div>

                  {/* Legend */}
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

                  </div>
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
              <h2 className="text-2xl">{t("selectTime")}</h2>
              {loadingSlots ? (
                <p className="mt-6 text-muted">{tc("loading")}</p>
              ) : slots.length === 0 ? (
                <p className="mt-6 text-muted">{t("noSlots")}</p>
              ) : (
                <div className="mt-6 flex justify-center">
                <div className="w-full max-w-2xl">
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                </div>
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
              <div className="flex justify-center">
              <div className="w-full max-w-2xl">
              <h2 className="text-2xl">{t("yourDetails")}</h2>
              <div className="mt-6 border border-border bg-background-secondary p-6 rounded-lg">
                <h3 className="text-xs uppercase tracking-widest text-muted">
                  {t("summary")}
                </h3>
                <p className="mt-2 text-xl">
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
                  <Label htmlFor="email">{t("email")} *</Label>
                  <Input id="email" name="email" type="email" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="phone">{t("phone")} *</Label>
                  <Input id="phone" name="phone" type="tel" required inputMode="tel" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="notes">{t("notes")}</Label>
                  <Textarea id="notes" name="notes" className="mt-2" />
                </div>
                <div className="flex items-start gap-3">
                  <input
                    id="agb"
                    type="checkbox"
                    required
                    checked={agbChecked}
                    onChange={(e) => setAgbChecked(e.target.checked)}
                    className="mt-1 h-4 w-4 cursor-pointer accent-[#b99672]"
                  />
                  <label htmlFor="agb" className="text-sm text-muted leading-relaxed cursor-pointer">
                    {locale === "de" ? (
                      <>Ich stimme den <a href="/de/legal/agb" target="_blank" className="underline hover:text-gold">AGB</a> zu. *</>
                    ) : (
                      <>I agree to the <a href="/en/legal/agb" target="_blank" className="underline hover:text-gold">Terms & Conditions</a>. *</>
                    )}
                  </label>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft size={16} /> {tc("back")}
                  </Button>
                  <Button type="submit" variant="gold" disabled={isPending || !agbChecked}>
                    {isPending ? tc("loading") : t("confirmBooking")}
                  </Button>
                </div>
              </form>
              </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </>
  );
}

