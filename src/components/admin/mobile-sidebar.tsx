"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  Menu,
  Settings,
  Star,
  Users,
  Briefcase,
  Images,
  Search,
  X,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminLang } from "@/components/admin/lang-context";

const navItems = [
  { href: "/admin", labelKey: "overview", icon: LayoutDashboard },
  { href: "/admin/appointments", labelKey: "appointments", icon: Calendar, badge: true },
  { href: "/admin/calendar", labelKey: "calendar", icon: Calendar },
  { href: "/admin/clients", labelKey: "clients", icon: Users },
  { href: "/admin/services", labelKey: "services", icon: Briefcase },
  { href: "/admin/portfolio", labelKey: "portfolio", icon: Image },
  { href: "/admin/testimonials", labelKey: "testimonials", icon: Star },
  { href: "/admin/blog", labelKey: "blog", icon: FileText },
  { href: "/admin/media", labelKey: "mediaLibrary", icon: Images },
  { href: "/admin/seo", labelKey: "seo", icon: Search },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
  { href: "/admin/guide", labelKey: "guide", icon: BookOpen },
];

export function MobileSidebarTrigger({ pendingCount = 0 }: { pendingCount?: number }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, dir, lang } = useAdminLang();
  const isRtl = dir === "rtl";

  const visibleItems = navItems.filter(
    (item) => item.href !== "/admin/guide" || lang === "fa"
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center p-2 text-muted hover:text-gold transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer â€” opens from right in RTL, left in LTR */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-64 bg-background transition-transform duration-300",
          isRtl ? "right-0 border-l border-border" : "left-0 border-r border-border",
          open
            ? "translate-x-0"
            : isRtl ? "translate-x-full" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/admin" className="text-lg" onClick={() => setOpen(false)}>
            Admin
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-gold transition-colors"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {visibleItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-background-secondary text-gold"
                    : "text-muted hover:bg-background-secondary hover:text-foreground",
                )}
              >
                <item.icon size={18} />
                <span className="flex-1">{t(item.labelKey)}</span>
                {item.badge && pendingCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-red-500 px-1.5 text-[11px] font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

