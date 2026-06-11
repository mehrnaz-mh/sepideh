import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { T } from "@/components/admin/t";
import { getClients, deleteClient } from "@/actions/clients";
import { ClientsTable } from "./clients-table";

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        titleKey="clients"
        descriptionKey="clientsDesc"
        createHref="/admin/clients/new"
        createLabelKey="newClient"
      />

      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 lg:hidden">
        {clients.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted"><T k="noClientsYet" /></p>
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
                    <Pencil size={16} />
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

      <ClientsTable clients={clients} />
    </div>
  );
}
