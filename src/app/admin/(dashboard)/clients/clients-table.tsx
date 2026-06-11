"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAdminLang } from "@/components/admin/lang-context";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { deleteClient } from "@/actions/clients";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  isVip: boolean;
  tags: string[];
  _count: { appointments: number };
};

export function ClientsTable({ clients }: { clients: Client[] }) {
  const { t, dir } = useAdminLang();
  const isRtl = dir === "rtl";
  const th = `px-4 py-3 text-xs uppercase tracking-widest font-medium text-muted ${isRtl ? "text-right" : "text-left"}`;
  const td = `px-4 py-3 ${isRtl ? "text-right" : "text-left"}`;

  return (
    <div className="hidden lg:block overflow-x-auto border border-border bg-background rounded-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-background-secondary">
          <tr>
            <th className={th}>{t("name")}</th>
            <th className={th}>{t("contact")}</th>
            <th className={th}>{t("tags")}</th>
            <th className={th}>{t("appointments")}</th>
            <th className={th}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted">{t("noClientsYet")}</td>
            </tr>
          ) : (
            clients.map((client) => (
              <tr key={client.id} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                <td className={td}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{client.firstName} {client.lastName}</span>
                    {client.isVip && <Badge variant="success">VIP</Badge>}
                  </div>
                </td>
                <td className={td}>
                  <div>{client.email}</div>
                  {client.phone && <div className="text-xs text-muted">{client.phone}</div>}
                </td>
                <td className={`${td} text-muted`}>
                  {client.tags.length > 0 ? client.tags.join(", ") : "—"}
                </td>
                <td className={td}>{client._count.appointments}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
