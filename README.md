# Tanishka Ladies Beauty Parlour

Premium luxury salon website built with Next.js 15 App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Framer Motion, Supabase, Prisma, Razorpay, React Hook Form, Zod and Nodemailer.

## Features

- Luxury responsive UI with white, rose gold, gold, beige and black design tokens.
- Home, About, Services, Bridal Packages, Gallery, Offers, Testimonials, Blog, Contact, FAQ and policy pages.
- Online appointment booking with service, staff, date, time, customer details, notes and language preference.
- Slot availability and double-booking prevention through Prisma/Postgres or local demo fallback.
- Razorpay order creation for advance payments when credentials are configured.
- Confirmation email through Nodemailer and WhatsApp confirmation link.
- Admin dashboard with token login, appointment status actions, analytics and CSV/PDF export.
- Gallery masonry layout with filters, lazy images and lightbox preview.
- PWA manifest, service worker, push notification handler, sitemap, robots and Schema.org JSON-LD.
- Dark mode, accessibility skip link, keyboard-friendly controls and SEO metadata.

## Getting Started

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```

Open `http://localhost:3000`.

## Environment

Set these values in `.env`:

- `DATABASE_URL`: Supabase Postgres or any Postgres connection string.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Supabase project keys.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay payment credentials.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: email delivery credentials.
- `ADMIN_TOKEN`: long random token required by `/admin`.
- `NEXT_PUBLIC_SITE_URL`: production canonical URL.

Without external credentials, the app still runs with sample data, in-memory demo bookings and disabled payment/email side effects.

## Database

Prisma schema lives in `prisma/schema.prisma`.

Supabase SQL with row-level security policies lives in `supabase/schema.sql`.

Run:

```bash
npm run prisma:generate
npm run prisma:push
```

For Supabase, paste `supabase/schema.sql` into the SQL editor, then add service role credentials to `.env`.

## Admin

Visit `/admin` and enter `ADMIN_TOKEN`. If no token is configured, local demo fallback is `demo-admin-token`.

Admin can view appointments, accept or reject bookings, export CSV/PDF reports and review placeholders for managing services, prices, gallery images, offers and testimonials.

## Production Checks

```bash
npm run lint
npm run build
npm run prisma:validate
```

Deploy to Vercel or any Node-compatible Next.js host. Configure environment variables and set `NEXT_PUBLIC_SITE_URL` to the live domain.
