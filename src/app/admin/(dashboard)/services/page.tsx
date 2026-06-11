"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { useAdminLang } from "@/components/admin/lang-context";
import { useEffect, useState } from "react";
import { getServices, deleteService } from "@/actions/services";

type Service = Awaited<ReturnType<typeof getServices>>[number];

export default function AdminServicesPage() {
  const { t, lang } = useAdminLang();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

  return (
    <div>
      <AdminPageHeader
        titleKey="servicesTitle"
        descriptionKey="servicesDesc"
        createHref="/admin/services/new"
        createLabelKey="newService"
      />

      <div className="grid gap-3">
        {services.map((service) => {
          const title =
            service.translations.find((tr) => tr.locale === "de")?.title ??
            service.slug;
          return (
            <div
              key={service.id}
              className="flex items-center justify-between border border-border bg-background p-5 rounded-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg">{title}</h2>
                  <Badge variant={service.isActive ? "success" : "default"}>
                    {service.isActive ? t("active") : t("inactive")}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted">{service.slug}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="text-muted hover:text-gold transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <DeleteButton action={deleteService.bind(null, service.id)} label="" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
