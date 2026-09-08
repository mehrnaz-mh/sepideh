-- Add the discount feature to an existing database without changing other tables.
CREATE TABLE IF NOT EXISTS "DiscountOffer" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "discountLabel" TEXT,
    "code" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "offerDe" TEXT NOT NULL,
    "offerEn" TEXT NOT NULL,
    "descriptionDe" TEXT,
    "descriptionEn" TEXT,
    "expiresAt" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "DiscountOffer_pkey" PRIMARY KEY ("id")
);

-- Also upgrades databases where the first version of this feature already exists.
ALTER TABLE "DiscountOffer" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "DiscountOffer" ADD COLUMN IF NOT EXISTS "discountLabel" TEXT;
ALTER TABLE "DiscountOffer" ADD COLUMN IF NOT EXISTS "clickCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "DiscountOffer_isActive_expiresAt_sortOrder_idx"
    ON "DiscountOffer"("isActive", "expiresAt", "sortOrder");
