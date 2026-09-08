import assert from "node:assert/strict";
import test from "node:test";
import { discountStatus, discountToday } from "./discounts";
import { discountOfferSchema, discountUrlSchema } from "../validations/discounts";

const validOffer = {
  brandName: "Brand",
  logoUrl: "",
  discountLabel: "15% OFF",
  code: "Sepideh-15",
  url: "https://brand.example/shop?ref=sepideh&campaign=beauty%20offers#products",
  offerDe: "15 % Rabatt",
  offerEn: "15% off",
  expiresAt: "",
  isActive: true,
  sortOrder: "0",
};

test("saves exact code case and referral query parameters, trimming surrounding whitespace", () => {
  const offer = discountOfferSchema.parse({ ...validOffer, code: " Sepideh-15 ", brandName: " Brand " });
  assert.equal(offer.code, "Sepideh-15");
  assert.equal(offer.url, validOffer.url);
  assert.equal(offer.brandName, "Brand");
  assert.equal(offer.sortOrder, 0);
});

test("shop links accept HTTP(S) and reject executable, relative and credential-bearing URLs", () => {
  for (const url of ["javascript:alert(1)", "data:text/html,test", "//brand.example", "/shop", "ftp://brand.example", "https://user:password@brand.example", "not a URL"]) {
    assert.equal(discountUrlSchema.safeParse(url).success, false, url);
  }
  for (const url of ["https://brand.example", "http://brand.example", validOffer.url]) {
    assert.equal(discountUrlSchema.safeParse(url).success, true, url);
  }
});

test("logos accept local assets and Cloudinary uploads but reject unconfigured remote hosts", () => {
  assert.equal(discountOfferSchema.safeParse({ ...validOffer, logoUrl: "/discount-logos/aurelia.svg" }).success, true);
  assert.equal(discountOfferSchema.safeParse({ ...validOffer, logoUrl: "https://res.cloudinary.com/demo/image/upload/logo.png" }).success, true);
  assert.equal(discountOfferSchema.safeParse({ ...validOffer, logoUrl: "https://unconfigured.example/logo.png" }).success, false);
});

test("rejects invalid calendar dates but supports leap days and no expiry", () => {
  for (const expiresAt of ["2026-02-30", "2026-02-29", "2026-13-01", "2026-09-00", "tomorrow"]) {
    assert.equal(discountOfferSchema.safeParse({ ...validOffer, expiresAt }).success, false, expiresAt);
  }
  for (const expiresAt of ["", "2028-02-29", "2026-09-07"]) {
    assert.equal(discountOfferSchema.safeParse({ ...validOffer, expiresAt }).success, true, expiresAt);
  }
});

test("requires both offer translations, a brand, a usable code and an integer order", () => {
  for (const update of [{ brandName: " " }, { offerDe: "" }, { offerEn: " " }, { code: "A B" }, { code: "A\nB" }, { sortOrder: "-1" }, { sortOrder: "1.5" }]) {
    assert.equal(discountOfferSchema.safeParse({ ...validOffer, ...update }).success, false);
  }
});

test("expiry changes at Berlin midnight in summer and winter, including daylight saving transitions", () => {
  assert.equal(discountToday(new Date("2026-09-07T21:59:59Z")), "2026-09-07");
  assert.equal(discountToday(new Date("2026-09-07T22:00:00Z")), "2026-09-08");
  assert.equal(discountToday(new Date("2026-01-07T22:59:59Z")), "2026-01-07");
  assert.equal(discountToday(new Date("2026-01-07T23:00:00Z")), "2026-01-08");
  assert.equal(discountToday(new Date("2026-03-29T22:00:00Z")), "2026-03-30");
  assert.equal(discountToday(new Date("2026-10-25T23:00:00Z")), "2026-10-26");
});

test("offers stay valid on the expiry date; disabled and expired offers are not active", () => {
  const today = "2026-09-07";
  assert.equal(discountStatus({ isActive: true, expiresAt: today }, today), "active");
  assert.equal(discountStatus({ isActive: true, expiresAt: null }, today), "active");
  assert.equal(discountStatus({ isActive: false, expiresAt: null }, today), "inactive");
  assert.equal(discountStatus({ isActive: true, expiresAt: "2026-09-06" }, today), "discountExpired");
});
