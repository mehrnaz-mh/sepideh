import { siteConfig } from "@/data/content";

export default function AdminSeoPage() {
  return (
    <div>
      <h1 className="text-3xl">SEO</h1>
      <div className="mt-8 space-y-6">
        <div className="border border-border bg-background p-6">
          <h2 className="text-xl">Site Configuration</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Site URL</dt>
              <dd>{process.env.NEXT_PUBLIC_SITE_URL || "Not set"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Default Locale</dt>
              <dd>{siteConfig.defaultLocale}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Locales</dt>
              <dd>{siteConfig.locales.join(", ")}</dd>
            </div>
          </dl>
        </div>
        <div className="border border-border bg-background p-6">
          <h2 className="text-xl">Structured Data</h2>
          <ul className="mt-4 list-inside list-disc text-sm text-muted">
            <li>LocalBusiness / BeautySalon schema on homepage</li>
            <li>Person schema on homepage</li>
            <li>FAQ schema on homepage</li>
            <li>Article schema on blog posts</li>
            <li>Breadcrumb schema on inner pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

