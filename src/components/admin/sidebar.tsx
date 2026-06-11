"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  FileText,
  Image,
  LayoutDashboard,
  Settings,
  Star,
  Users,
  Briefcase,
  Images,
  Search,
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

export function AdminSidebar({ pendingCount = 0 }: { pendingCount?: number }) {
  const pathname = usePathname();
  const { t, dir, lang } = useAdminLang();
  const isRtl = dir === "rtl";

  const visibleItems = navItems.filter(
    (item) => item.href !== "/admin/guide" || lang === "fa"
  );

  return (
    <aside className={cn(
      "fixed inset-y-0 z-40 w-64 border-border bg-background",
      isRtl ? "right-0 border-l" : "left-0 border-r"
    )}>
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/admin" className="text-lg">
          Admin
        </Link>
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
  );
}

