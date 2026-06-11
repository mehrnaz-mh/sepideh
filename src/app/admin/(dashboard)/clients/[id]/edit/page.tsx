import { notFound } from "next/navigation";
import { getClient } from "@/actions/clients";
import { EditClientClient } from "./edit-client-client";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) notFound();

  return (
    <EditClientClient
      id={id}
      client={{
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        locale: client.locale,
        tags: client.tags,
        isVip: client.isVip,
        notes: client.notes,
      }}
    />
  );
}
