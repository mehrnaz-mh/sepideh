import { AdminSidebar } from "@/components/admin/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background-secondary">
      <AdminSidebar />
      <div className="pl-64">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-8">
          <p className="text-sm text-muted">
            Welcome, {session.user.name}
          </p>
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
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
