import { redirect } from "next/navigation";
import { siteConfig } from "@/data/content";

export default function RootPage() {
  redirect(`/${siteConfig.defaultLocale}`);
}
