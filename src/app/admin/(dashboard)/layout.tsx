import { AdminSidebar } from "@/components/admin/sidebar";
import { MobileSidebarTrigger } from "@/components/admin/mobile-sidebar";
import { ToastNotification } from "@/components/admin/toast-notification";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  let pendingCount = 0;
  try {
    pendingCount = await prisma.appointment.count({ where: { status: "PENDING" } });
  } catch {}

  return (
    <div className="min-h-screen bg-background-secondary overflow-x-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar pendingCount={pendingCount} />
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <div className="lg:hidden">
              <MobileSidebarTrigger pendingCount={pendingCount} />
            </div>
            <p className="text-sm text-muted">
              Welcome, <span className="text-foreground">{session.user.name}</span>
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              const { signOut } = await import("@/lib/auth");
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-gold"
            >
              Sign Out
            </button>
          </form>
        </header>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      <Suspense>
        <ToastNotification />
      </Suspense>
    </div>
  );
}
