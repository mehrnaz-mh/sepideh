import { getPortfolioCategories, getPortfolioItems } from "@/actions/portfolio";
import { prisma } from "@/lib/prisma";
import { PortfolioClient } from "./portfolio-client";

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [categories, items, services] = await Promise.all([
    getPortfolioCategories(),
    getPortfolioItems(),
    prisma.service.findMany({ include: { translations: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <PortfolioClient
      categories={categories}
      items={items}
      services={services}
      error={error}
    />
  );
}
