import { AdminShell } from "@/components/admin/admin-shell";
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
    <>
      <AdminShell
        pendingCount={pendingCount}
        userName={session.user.name ?? ""}
      >
        {children}
      </AdminShell>
      <Suspense>
        <ToastNotification />
      </Suspense>
    </>
  );
}
