import { z } from "zod";

export const discountUrlSchema = z.string().trim().max(4000).refine((value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}, "discountInvalidUrl");

const logoUrlSchema = z.string().trim().max(4000).refine((value) => {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}, "discountInvalidLogo");

const expirySchema = z.string().trim().refine((value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "discountInvalidExpiry");

export const discountOfferSchema = z.object({
  brandName: z.string().trim().min(1, "discountBrandRequired").max(120, "discountTextTooLong"),
  logoUrl: logoUrlSchema,
  discountLabel: z.string().trim().min(1, "discountLabelRequired").max(40, "discountTextTooLong"),
  code: z.string().trim().min(1, "discountCodeRequired").max(100, "discountTextTooLong")
    .regex(/^\S+$/, "discountInvalidCode"),
  url: discountUrlSchema,
  offerDe: z.string().trim().min(1, "discountOfferRequired").max(160, "discountTextTooLong"),
  offerEn: z.string().trim().min(1, "discountOfferRequired").max(160, "discountTextTooLong"),
  expiresAt: expirySchema,
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int("discountInvalidOrder").min(0, "discountInvalidOrder").max(100000, "discountInvalidOrder"),
});
