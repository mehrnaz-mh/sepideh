import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { getServices, deleteService } from "@/actions/services";
export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage beauty services"
        createHref="/admin/services/new"
        createLabel="New Service"
      />

      <div className="grid gap-4">
        {services.map((service) => {
          const title = service.translations.find((t) => t.locale === "de")?.title ?? service.slug;
          return (
            <div
              key={service.id}
              className="flex items-center justify-between border border-border bg-background p-6"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl">{title}</h2>
                  <Badge variant={service.isActive ? "success" : "default"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {service.durationMinutes} min · {service.slug}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="text-xs uppercase tracking-wide text-gold hover:underline"
                >
                  Edit
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
