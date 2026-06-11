import { notFound } from "next/navigation";
import { getPortfolioItem } from "@/actions/portfolio";
import { prisma } from "@/lib/prisma";
import { EditPortfolioClient } from "./edit-portfolio-client";

export default async function EditPortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) notFound();

  const [categories, services] = await Promise.all([
    prisma.portfolioCategory.findMany({ include: { translations: true } }),
    prisma.service.findMany({ include: { translations: true } }),
  ]);

  return (
    <EditPortfolioClient
      id={id}
      item={{
        slug: item.slug,
        categoryId: item.categoryId,
        serviceId: item.serviceId,
        sortOrder: item.sortOrder,
        featured: item.featured,
        mediaFiles: item.mediaFiles,
        translations: item.translations,
      }}
      categories={categories}
      services={services}
    />
  );
}
