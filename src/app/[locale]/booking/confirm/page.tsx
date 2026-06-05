import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { isEmailConfigured } from "@/lib/resend";
import { Check, AlertTriangle } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "de" ? "Buchung bestätigt" : "Booking Confirmed",
  };
}

export default async function BookingConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ id?: string; email?: string; emailError?: string }>;
}) {
  const { locale } = await params;
  const { email, emailError } = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  const emailFailed = email === "failed";
  const emailNotConfigured = !isEmailConfigured();

  return (
    <section className="section-padding">
      <div className="luxury-container max-w-xl text-center">
        <FadeIn>
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
              emailFailed || emailNotConfigured ? "bg-amber-500/10" : "bg-gold/10"
            }`}
          >
            {emailFailed || emailNotConfigured ? (
              <AlertTriangle className="text-amber-600" size={32} />
            ) : (
              <Check className="text-gold" size={32} />
            )}
          </div>
          <h1 className="mt-8 text-4xl">{t("pendingTitle")}</h1>
          {emailFailed || emailNotConfigured ? (
            <div className="mt-4 space-y-3 text-left text-sm">
              <p className="text-muted">{t("pendingDescriptionNoEmail")}</p>
              {(emailError || emailNotConfigured) && (
                <p className="border border-amber-200 bg-amber-50 p-4 text-amber-900">
                  {emailNotConfigured
                    ? t("emailNotConfigured")
                    : emailError || t("emailSendFailed")}
                </p>
              )}
              {process.env.NODE_ENV === "development" && (
                <p className="text-xs text-muted">
                  Dev: set <code className="text-foreground">RESEND_API_KEY</code> and{" "}
                  <code className="text-foreground">BOOKING_TEST_EMAIL</code> in{" "}
                  <code className="text-foreground">.env</code>, restart the server, then open{" "}
                  <code className="text-foreground">/api/dev/test-email</code>
                </p>
              )}
            </div>
          ) : (
            <p className="mt-4 text-muted">{t("pendingDescription")}</p>
          )}
          <Button asChild variant="gold" className="mt-10">
            <Link href="/">Home</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
