import { readFileSync } from "fs";
import { join } from "path";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

function loadMessages(locale: string) {
  const filePath = join(process.cwd(), "messages", `${locale}.json`);
  return JSON.parse(readFileSync(filePath, "utf-8")) as Record<string, unknown>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: loadMessages(locale),
  };
});
