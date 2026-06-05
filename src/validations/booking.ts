import { z } from "zod";

export const bookingSchema = z.object({
  serviceSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(5, "Phone number is required"),
  notes: z.string().max(1000).optional(),
  locale: z.enum(["de", "en"]).default("de"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
