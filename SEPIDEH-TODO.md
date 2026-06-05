# Sepideh's Setup Checklist

## Section A — Must Do Before Launch

---

### 1. Set Domain in Vercel

1. Go to [vercel.com](https://vercel.com) and open your project
2. Click **Settings** → **Domains**
3. Add your domain (e.g. `sepidehmihanparast.de`)
4. Follow the instructions to update your domain's DNS settings
5. Then go to **Settings** → **Environment Variables**
6. Find `NEXT_PUBLIC_SITE_URL` and change the value to your domain:
   ```
   https://sepidehmihanparast.de
   ```
7. Redeploy the project (Deployments → three dots → Redeploy)

---

### 2. Create og:image

This image appears when your website link is shared on WhatsApp, Instagram, etc.

1. Go to [canva.com](https://canva.com) (free)
2. Create a new design with size **1200 × 630 pixels**
3. Add your name, a nice photo, and "Hair & Makeup Hamburg"
4. Download as **JPG**
5. Rename the file to exactly: `og-image.jpg`
6. Send it to your developer — it goes in the `/public/` folder

---

### 3. Complete the Impressum — Tax Information

Your Impressum currently has placeholders. You need to fill in:

**Required:**
- **Steuernummer** — your tax number, looks like: `22/123/45678`
  - Find it on your Steuerbescheid letter or log in to [elster.de](https://elster.de)
- **Finanzamt** — the name of your tax office, e.g. `Finanzamt Hamburg-Nord`

**Only if you are NOT a Kleinunternehmer (§19 UStG):**
- **Umsatzsteuer-ID (USt-IdNr.)** — looks like: `DE123456789`
- If you earn less than €25,000/year, you are likely a Kleinunternehmer and do NOT need this

Send these to your developer and they will update the Impressum.

---

### 4. Email Setup (Cloudflare + Resend)

This lets your website send emails from your own domain address instead of a generic address.

**Step 1 — Add domain to Cloudflare:**
1. Go to [cloudflare.com](https://cloudflare.com) → create a free account
2. Click **Add a Site** → enter your domain → choose Free plan
3. Replace your domain's nameservers with the Cloudflare ones (takes 10–30 min)

**Step 2 — Set up Email Routing:**
1. In Cloudflare → go to **Email** → **Email Routing** → Enable
2. Click **Create address**
3. Set it up like this:
   - From: `info@yourdomain.de` (or `bookings@yourdomain.de`)
   - Forward to: `se.mihanparast@yahoo.com`
4. Verify your Yahoo email when asked

**Step 3 — Tell your developer:**
Send them this message:
> "Email routing is set up. Please update `RESEND_FROM_EMAIL` to `info@yourdomain.de`"

---

### 5. Have AGB and Datenschutz Reviewed by a Lawyer

The legal pages are functional but should be reviewed before going live.

- Use [e-recht24.de](https://e-recht24.de) (online service, ~€5–15/month) or
- Hire an IT law lawyer (~€200–300 one-time)

---

## Section B — First Month After Launch

---

### 6. Google Business Profile

This puts your business on Google Maps and Google Search.

1. Go to [business.google.com](https://business.google.com)
2. Click **Add your business**
3. Fill in:
   - Name: `Sepideh Mihanparast`
   - Category: `Make-up Artist` and/or `Hair Salon`
   - Address: `Eppendorfer Weg 13, 20259 Hamburg`
   - Phone: `+49 176 567 33300`
   - Website: your domain
4. Add photos (at least 5 good ones)
5. Verify your business (Google sends a postcard or calls)

---

### 7. Google Search Console

This shows you how many people find your website on Google.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add property** → enter your domain
3. Verify ownership (easiest via Cloudflare DNS)
4. Go to **Sitemaps** → submit: `https://yourdomain.de/sitemap.xml`
5. Check back every 2 weeks

---

### 8. Portfolio Alt Texts

Alt texts help Google understand your photos and improve SEO.

There is a file in the project called `alt-texts.md`. Fill in a short description for each photo — what it shows, what style, what occasion.

Example:
```
can-01.jpg — Classic bridal updo with pearl accessories, Hamburg 2024
can-04.jpg — Red carpet hair styling for Parinaz Izadyar, Cannes Film Festival 2025
```

Send the completed file to your developer.

---

### 9. Product Brands in FAQ

The FAQ "What products do you use?" currently has a placeholder answer.

Write down the real brand names you use (e.g. MAC, Charlotte Tilbury, Oribe, GHD, etc.) and send them to your developer to update.

---

### 10. Blog Posts

Your blog posts are currently very short. Google penalizes thin content.

Each blog post should be **at least 500 words**. Write the full text for each post and send to your developer.

Topics you could cover:
- How to prepare for your wedding hair & makeup appointment
- Red carpet beauty trends
- The difference between editorial and bridal makeup
- Why hiring a professional hair stylist matters

---

### 11. Instagram Bio Link

Add your website to your Instagram bio so clients can book directly.

1. Open Instagram → Edit Profile
2. In the **Website** field, enter your domain: `https://yourdomain.de`
3. In your captions, mention "Link in bio" when relevant

---

## Section C — Every Month (5 Minutes)

---

### 12. Google Search Console Check

- Open [search.google.com/search-console](https://search.google.com/search-console)
- Check: traffic, which keywords people use, any errors
- If you see a red warning, send a screenshot to your developer

---

### 13. Resend Dashboard Check

- Go to [resend.com](https://resend.com) → Emails
- Make sure booking confirmation emails are being delivered
- If delivery rate drops below 95%, contact your developer

---

### 14. Ask Clients for Google Reviews

After each appointment, ask your client to leave a Google review. This is the single most effective way to get new clients from Google.

You can send them a direct link:
`https://g.page/r/YOUR_PLACE_ID/review`
(Get this link from your Google Business Profile)

---

## Section D — Directories (Free, Do Once)

Register your business on these free directories for more visibility:

| Directory | Link |
|---|---|
| Treatwell | [treatwell.de](https://treatwell.de) |
| Yelp | [yelp.de](https://yelp.de) |
| Weddyplace | [weddyplace.de](https://weddyplace.de) |
| Hamburg Business Directory | [hamburg.de](https://hamburg.de) |

Use the same information everywhere:
- Name: `Sepideh Mihanparast`
- Address: `Eppendorfer Weg 13, 20259 Hamburg`
- Phone: `+49 176 567 33300`
- Website: your domain

---

## Quick Reference — Your Contact Info on the Website

Make sure this is consistent everywhere (it already is in the website):

| Field | Value |
|---|---|
| Name | Sepideh Mihanparast |
| Address | Eppendorfer Weg 13, 20259 Hamburg |
| Phone | +49 176 567 33300 |
| WhatsApp | +49 176 567 33300 |
| Email | se.mihanparast@yahoo.com |
| Instagram | @beautyartist.sepid |
| Google Maps | https://maps.google.com/?q=Eppendorfer+Weg+13+20259+Hamburg |
