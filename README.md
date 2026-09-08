# Sepideh Mihanparast — Luxury Beauty Platform

A full-stack Next.js application for professional hair styling and makeup artistry in Hamburg, Germany.

## Features

- **Marketing Website** — Luxury editorial design (DE/EN)
- **Portfolio Gallery** — Filter, search, lightbox, infinite scroll
- **Booking System** — Service selection, availability, email confirmations, ICS invites
- **Admin Dashboard** — Appointments, CRM, services, portfolio, blog, settings
- **SEO** — Metadata, structured data, sitemap, hreflang
- **Legal Pages** — Impressum, Datenschutz, AGB, Cookies, Widerruf (template — review with lawyer)

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS · Prisma · PostgreSQL · Auth.js · next-intl · Framer Motion · Resend · Cloudinary · Google Calendar

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set `DATABASE_URL` to your PostgreSQL connection string (Neon, Supabase, or local).

### 3. Set up database

```bash
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

- **Website:** http://localhost:3000/de
- **Admin:** http://localhost:3000/admin/login

Default admin credentials (from seed):
- Email: `admin@sepidehmihanparast.de`
- Password: `Sepide2025!` (or value of `ADMIN_PASSWORD` in `.env`)

## Local testing with PostgreSQL

With Docker Desktop running:

```bash
npm run local:setup
npm run dev:local
```

The setup creates a separate PostgreSQL database on `127.0.0.1:5433`, writes ignored development settings to `.env.development.local`, applies the schema and seeds the existing site content. It refuses to push or seed any database outside this local target. Re-running setup also resets the local admin to the credentials in that file.

Open `http://localhost:3000/admin/login` and use the local `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env.development.local`. Manage test offers at `/admin/discounts` and view them at `/de/discounts` or `/en/discounts`.

`npm run local:stop` stops only this project's database and keeps its data. Run `npm run local:setup` to start it again. The generated environment file applies only to development; the existing `.env` remains in place.

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Add environment variables from `.env.example`
3. Connect Neon PostgreSQL and set `DATABASE_URL`
4. Run `npm run db:push && npm run db:seed` against production DB
5. Configure custom domain and `NEXT_PUBLIC_SITE_URL`

### Cron (Reminder Emails)

Add Vercel Cron to hit `/api/cron/reminders` daily with `Authorization: Bearer CRON_SECRET`.

## Brand Discount Codes

- Manage offers at `/admin/discounts`; public pages are `/de/discounts` and `/en/discounts`.
- Add the brand name, optional uploaded logo, discount badge, exact discount code, complete shop/referral URL, German and English offer headlines, and an optional expiry date. The page-wide description is managed in the translations and is shared by every offer. Enable “Show this offer on the website” to publish it.
- Visitors can copy the code and open the brand shop in a new tab. Referral parameters are preserved. Attribution and purchase reporting depend on the brand's referral system.
- Store-link clicks pass through an internal redirect and are counted per offer in the admin panel. These are click totals, not verified purchases.
- Disabled offers are hidden. Expiry dates include the entire day in `Europe/Berlin`.
- Admins and editors can create, edit and delete offers. Offers are not seeded with example promotions.

For an existing database, apply only the additive discount table update before deploying:

```bash
npx prisma db execute --file prisma/updates/20260907_discount_offers.sql --schema prisma/schema.prisma
npm run db:generate
```

For a new database, the regular `npm run db:push` setup includes this table.

Run the discount validation and expiry checks with:

```bash
node --import tsx --test src/lib/discounts.test.ts
```

To recreate the six fictional local preview cards, run `npm run local:discounts-demo`. This command refuses to write outside the isolated local database.

## Portfolio Content

Images extracted from `Portfolio.pdf` are in `/public/portfolio/`. Seed data maps portfolio items, services, testimonials, and bio from the PDF.

## Legal Notice

German legal page templates are placeholders. Have Impressum, Datenschutzerklärung, and AGB reviewed by a qualified lawyer before launch.
