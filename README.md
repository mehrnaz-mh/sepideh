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

## Deployment (Vercel)

1. Push to GitHub and import in Vercel
2. Add environment variables from `.env.example`
3. Connect Neon PostgreSQL and set `DATABASE_URL`
4. Run `npm run db:push && npm run db:seed` against production DB
5. Configure custom domain and `NEXT_PUBLIC_SITE_URL`

### Cron (Reminder Emails)

Add Vercel Cron to hit `/api/cron/reminders` daily with `Authorization: Bearer CRON_SECRET`.

## Portfolio Content

Images extracted from `Portfolio.pdf` are in `/public/portfolio/`. Seed data maps portfolio items, services, testimonials, and bio from the PDF.

## Legal Notice

German legal page templates are placeholders. Have Impressum, Datenschutzerklärung, and AGB reviewed by a qualified lawyer before launch.
