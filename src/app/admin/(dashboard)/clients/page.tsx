import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { getClients, deleteClient } from "@/actions/clients";

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <AdminPageHeader
        title="Clients"
        description="CRM — manage client profiles and history"
        createHref="/admin/clients/new"
        createLabel="New Client"
      />

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Contact</th>
              <th className="px-4 py-3 text-left font-medium">Tags</th>
              <th className="px-4 py-3 text-left font-medium">Appointments</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {client.firstName} {client.lastName}
                    </span>
                    {client.isVip && <Badge variant="success">VIP</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>{client.email}</div>
                  {client.phone && <div className="text-xs text-muted">{client.phone}</div>}
                </td>
                <td className="px-4 py-3 text-muted">
                  {client.tags.length > 0 ? client.tags.join(", ") : "—"}
                </td>
                <td className="px-4 py-3">{client._count.appointments}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/clients/${client.id}/edit`}
                    className="mr-3 text-xs uppercase tracking-wide text-gold hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteClient.bind(null, client.id)}
                    label=""
                    confirmMessage={
                      client._count.appointments > 0
                        ? `Delete ${client.firstName} ${client.lastName} and all ${client._count.appointments} appointment(s)? This cannot be undone.`
                        : `Delete client ${client.firstName} ${client.lastName}?`
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
