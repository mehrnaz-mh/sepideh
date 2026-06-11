import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EditAvailabilityClient } from "./edit-availability-client";

export default async function EditAvailabilityRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await prisma.availabilityRule.findUnique({ where: { id } });
  if (!rule) notFound();

  return <EditAvailabilityClient rule={rule} />;
}
