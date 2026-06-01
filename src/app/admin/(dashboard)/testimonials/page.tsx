import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminFormShell } from "@/components/admin/form-shell";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from "@/actions/testimonials";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();

  async function createAction(formData: FormData) {
    "use server";
    const result = await createTestimonial(formData);
    if (!result.success) redirect("/admin/testimonials?error=1");
    redirect("/admin/testimonials");
  }

  return (
    <div className="space-y-10">
      <AdminPageHeader title="Testimonials" description="Manage client reviews" />

      <form action={createAction} className="space-y-6 border border-border bg-background p-6">
        <h2 className="font-serif text-xl">Add Testimonial</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Client Name" name="clientName" required />
          <FormField label="Event Type" name="eventType" placeholder="Wedding, Gala..." />
          <SelectField
            label="Type"
            name="type"
            defaultValue="TEXT"
            options={[
              { value: "TEXT", label: "Text" },
              { value: "PHOTO", label: "Photo" },
              { value: "VIDEO", label: "Video" },
            ]}
          />
          <FormField label="Rating (1-5)" name="rating" type="number" min="1" max="5" />
          <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={0} />
          <CheckboxField label="Featured" name="featured" />
          <div className="md:col-span-2">
            <TextAreaField label="Content (DE)" name="contentDe" required />
          </div>
          <div className="md:col-span-2">
            <TextAreaField label="Content (EN)" name="contentEn" required />
          </div>
        </div>
        <SubmitButton label="Add Testimonial" />
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => {
          const content = item.translations.find((t) => t.locale === "de")?.content;
          return (
            <div key={item.id} className="border border-border bg-background p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-lg">— {item.clientName}</p>
                  {item.featured && (
                    <span className="text-xs uppercase text-gold">Featured</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/testimonials/${item.id}/edit`}
                    className="text-xs uppercase text-gold"
                  >
                    Edit
                  </Link>
                  <DeleteButton action={deleteTestimonial.bind(null, item.id)} label="" />
                </div>
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-4">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
