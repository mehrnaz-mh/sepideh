import { requireAdmin } from "@/lib/admin";
import { DiscountForm } from "../discount-form";

export default async function NewDiscountPage() {
  await requireAdmin();
  return <DiscountForm />;
}
