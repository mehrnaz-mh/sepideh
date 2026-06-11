"use client";

import { AdminSidebar } from "@/components/admin/sidebar";
import { MobileSidebarTrigger } from "@/components/admin/mobile-sidebar";
import { AdminLangProvider, useAdminLang } from "@/components/admin/lang-context";
import { signOutAction } from "@/app/admin/sign-out-action";

function ShellInner({
  children,
  pendingCount,
  userName,
}: {
  children: React.ReactNode;
  pendingCount: number;
  userName: string;
}) {
  const { lang, setLang, t, dir } = useAdminLang();
  const isFa = lang === "fa";

  return (
    <div
      className="min-h-screen bg-background-secondary overflow-x-hidden"
      dir={dir}
      style={{ fontFamily: isFa ? "var(--font-vazirmatn), sans-serif" : undefined }}
    >
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar pendingCount={pendingCount} />
      </div>

      {/* Main content */}
      <div className={isFa ? "lg:pr-64" : "lg:pl-64"}>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="lg:hidden">
              <MobileSidebarTrigger pendingCount={pendingCount} />
            </div>
            <p className="text-sm text-muted">
              {t("welcome")},{" "}
              <span className="text-foreground">{userName}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language toggle */}
            <button
              onClick={() => setLang(isFa ? "en" : "fa")}
              className="border border-border rounded-sm px-3 py-1.5 text-xs text-muted hover:border-gold hover:text-gold transition-colors"
              title={isFa ? "Switch to English" : "تغییر به فارسی"}
            >
              {isFa ? (
                <span className="tracking-widest uppercase">EN</span>
              ) : (
                <span style={{ fontFamily: "var(--font-vazirmatn), sans-serif" }}>فا</span>
              )}
            </button>

            {/* Sign out */}
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm text-muted transition-colors hover:text-gold"
              >
                {t("signOut")}
              </button>
            </form>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  pendingCount,
  userName,
}: {
  children: React.ReactNode;
  pendingCount: number;
  userName: string;
}) {
  return (
    <AdminLangProvider>
      <ShellInner pendingCount={pendingCount} userName={userName}>
        {children}
      </ShellInner>
    </AdminLangProvider>
  );
}
