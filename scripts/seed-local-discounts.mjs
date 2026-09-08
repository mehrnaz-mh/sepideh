import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const environment = Object.fromEntries(
  readFileSync(".env.development.local", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    }),
);
const databaseUrl = new URL(environment.DATABASE_URL ?? "");
if (
  databaseUrl.protocol !== "postgresql:" ||
  databaseUrl.hostname !== "127.0.0.1" ||
  databaseUrl.port !== "5433" ||
  databaseUrl.pathname !== "/sepideh_local"
) {
  throw new Error("Demo discounts can only be written to the isolated local database.");
}

const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl.toString() } } });
const brandNames = ["Aurelia Skin", "Veloura Beauty", "Lumière Hair", "Noura Cosmetics", "Elara Beauty", "Maison Bloom"];
const offers = [
  ["Aurelia Skin", "/discount-logos/aurelia.svg", "15% OFF", "AURELIA15", "15 % auf ausgewählte Hautpflege", "15% off selected skincare"],
  ["Veloura Beauty", "/discount-logos/veloura.svg", "20% OFF", "VELOURA20", "20 % auf deine erste Bestellung", "20% off your first order"],
  ["Lumière Hair", "/discount-logos/lumiere.svg", "10% OFF", "LUMIERE10", "10 % auf Haarpflege", "10% off hair care"],
  ["Noura Cosmetics", "/discount-logos/noura.svg", "25% OFF", "NOURA25", "25 % auf Make-up-Favoriten", "25% off makeup favourites"],
  ["Elara Beauty", "/discount-logos/elara.svg", "FREE GIFT", "ELARAGIFT", "Gratis Geschenk zur Bestellung", "Free gift with your order"],
  ["Maison Bloom", "/discount-logos/maison-bloom.svg", "€15 OFF", "BLOOM15", "15 € Rabatt ab 75 €", "€15 off orders over €75"],
].map(([brandName, logoUrl, discountLabel, code, offerDe, offerEn], index) => ({
  brandName,
  logoUrl,
  discountLabel,
  code,
  offerDe,
  offerEn,
  url: `https://example.com/?brand=${encodeURIComponent(brandName)}`,
  expiresAt: new Date("2027-12-31T00:00:00.000Z"),
  isActive: true,
  sortOrder: index + 10,
}));

try {
  await prisma.discountOffer.deleteMany({ where: { brandName: { in: brandNames } } });
  await prisma.discountOffer.createMany({ data: offers });
  console.log(`Created ${offers.length} fictional offers in the local database.`);
} finally {
  await prisma.$disconnect();
}
