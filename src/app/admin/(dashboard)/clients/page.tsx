import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { getClients, deleteClient } from "@/actions/clients";

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        title="Clients"
        description="Manage client profiles and history"
        createHref="/admin/clients/new"
        createLabel="New Client"
      />

      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 lg:hidden">
        {clients.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No clients yet</p>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="border border-border bg-background rounded-sm p-4 min-w-0">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="truncate font-medium text-sm text-foreground">
                      {client.firstName} {client.lastName}
                    </p>
                    {client.isVip && <Badge variant="success">VIP</Badge>}
                  </div>
                  <p className="truncate text-xs text-muted">{client.email}</p>
                  {client.phone && <p className="text-xs text-muted">{client.phone}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <Link
                    href={`/admin/clients/${client.id}/edit`}
                    className="text-muted hover:text-gold transition-colors"
                    title="Edit"
                  >
                    <Pencil size={15} />
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
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                {client.tags.length > 0 && <span>{client.tags.join(", ")}</span>}
                <span>{client._count.appointments} appointment{client._count.appointments !== 1 ? "s" : ""}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block overflow-x-auto border border-border bg-background rounded-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Name</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Contact</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Tags</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Appointments</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">No clients yet</td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr key={client.id} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{client.firstName} {client.lastName}</span>
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
                      className="mr-3 text-muted hover:text-gold transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} className="inline" />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
