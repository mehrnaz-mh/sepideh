import { z } from "zod";

export const localeSchema = z.enum(["de", "en"]);

export const clientSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  notes: z.string().optional(),
  tags: z.string().optional(),
  isVip: z.boolean().optional(),
  locale: localeSchema.default("de"),
});

export const serviceSchema = z.object({
  slug: z.string().min(1).max(80),
  durationMinutes: z.coerce.number().min(15).max(480),
  bufferMinutes: z.coerce.number().min(0).max(120),
  isActive: z.boolean().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  titleDe: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionDe: z.string().min(1),
  descriptionEn: z.string().min(1),
  shortDescDe: z.string().optional(),
  shortDescEn: z.string().optional(),
});

export const appointmentSchema = z.object({
  clientId: z.string().min(1),
  serviceId: z.string().min(1),
  startTime: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "NO_SHOW"]),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  locale: localeSchema.default("de"),
});

export const portfolioCategorySchema = z.object({
  slug: z.string().min(1).max(80),
  sortOrder: z.coerce.number().min(0).default(0),
  nameDe: z.string().min(1),
  nameEn: z.string().min(1),
});

export const portfolioItemSchema = z.object({
  slug: z.string().min(1).max(80),
  categoryId: z.string().min(1),
  serviceId: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  imageUrl: z.string().min(1),
  titleDe: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionDe: z.string().optional(),
  descriptionEn: z.string().optional(),
  altTextDe: z.string().optional(),
  altTextEn: z.string().optional(),
});

export const testimonialSchema = z.object({
  clientName: z.string().min(1),
  type: z.enum(["TEXT", "PHOTO", "VIDEO"]).default("TEXT"),
  rating: z.coerce.number().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().min(0).default(0),
  eventType: z.string().optional(),
  contentDe: z.string().min(1),
  contentEn: z.string().min(1),
});

export const blogCategorySchema = z.object({
  slug: z.string().min(1).max(80),
  sortOrder: z.coerce.number().min(0).default(0),
  nameDe: z.string().min(1),
  nameEn: z.string().min(1),
});

export const blogPostSchema = z.object({
  slug: z.string().min(1).max(120),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().optional(),
  titleDe: z.string().min(1),
  titleEn: z.string().min(1),
  excerptDe: z.string().optional(),
  excerptEn: z.string().optional(),
  contentDe: z.string().min(1),
  contentEn: z.string().min(1),
  tags: z.string().optional(),
});

export const mediaSchema = z.object({
  url: z.string().min(1),
  altText: z.string().optional(),
  folder: z.string().optional(),
  publicId: z.string().optional(),
  cloudinaryId: z.string().optional(),
  secureUrl: z.string().optional(),
  format: z.string().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  bytes: z.coerce.number().optional(),
});

export const blockedDateSchema = z.object({
  date: z.string().min(1),
  reason: z.string().optional(),
  allDay: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  isActive: z.boolean().optional(),
});

export const settingsSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  instagram: z.string().url().optional().or(z.literal("")),
  location: z.string().min(1),
});
