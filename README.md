# Regnum Pavilion

A fully functional React website for Regnum Pavilion — hotel rooms, restaurant,
boardroom, and an 800 sqm event hall in Ipaja, Lagos. Built from the Claude
Design handoff, using the **Cinematic** homepage direction.

- **Stack:** Vite + React 18 + React Router
- **Database / forms:** Supabase (Postgres) via `@supabase/supabase-js`
- **Design system:** Paper `#FAF8F5`, Ink `#1A1714`, Bronze `#9B7B56`,
  Warm Grey `#E8E3DB`; Cormorant Garamond (display) + DM Sans (body).

## Quick start

```bash
npm install
npm run dev
```

The site runs immediately at http://localhost:5173. Forms work in the UI right
away — until Supabase is connected they show a friendly “database isn’t
connected yet” note instead of saving (the payload is also logged to the
console so you can see what would be stored).

## Connect Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates one
   table per form and enables Row Level Security so the public key can submit
   forms but not read other people’s data.
3. Copy `.env.example` to `.env.local` and fill in your project values from
   **Project Settings → API**:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

4. Restart `npm run dev`. Submissions now save to Supabase. Review them in the
   dashboard under **Table Editor**.

> Only the **anon (public)** key belongs in `.env.local`. Never put the
> `service_role` key in front-end code.

## Room deposits via Paystack

Booking a room requires a 50% deposit, paid up front through Paystack, to
deter spam bookings. Payment is verified **server-side** — the booking is
only created once `/api/verify-paystack` (a Vercel serverless function)
confirms the payment with Paystack directly, so nobody can fake a "successful
payment" in the browser and get a free booking.

1. Run [`supabase/payments.sql`](supabase/payments.sql) in the Supabase SQL
   Editor, after `schema.sql` and `availability.sql`. It adds payment columns
   to `room_bookings` and locks the table down so only the server
   (`service_role` key) can create a booking — the public key no longer can.
2. Get your keys from the [Paystack dashboard](https://dashboard.paystack.com)
   → **Settings → API Keys & Webhooks**.
3. Add `VITE_PAYSTACK_PUBLIC_KEY` to `.env.local` (safe to ship in the client).
4. In your hosting provider's environment settings (e.g. Vercel → Project →
   Settings → Environment Variables), add the **server-only** variables —
   see `.env.example` for the full list and where to find each one:
   - `PAYSTACK_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_URL` (reused server-side; not secret)
   - `RESEND_API_KEY` / `RESEND_FROM_EMAIL` — optional, sends the guest a
     confirmation email once payment is verified (sign up at
     [resend.com](https://resend.com) and verify a sending domain). Without
     these, booking still works — the guest just won't get an email.

Start in Paystack's **test mode** (test keys, test cards) until you're ready
to go live, then switch to live keys.

## Where the forms go

| Page / widget                         | Supabase table            |
| ------------------------------------- | ------------------------- |
| Contact → Send a message              | `contact_messages`        |
| Rooms / Room detail → Book Now        | `room_bookings`           |
| Restaurant → Reserve a Table          | `restaurant_reservations` |
| Boardroom → Submit Booking            | `boardroom_bookings`      |
| Event Hall → Submit Inquiry           | `event_enquiries`         |
| “Check Availability” bars (all pages) | `availability_requests`   |

## Pages

`/` Home · `/rooms` + `/rooms/:slug` · `/restaurant` · `/boardroom` ·
`/events` · `/location` · `/contact`

## Project structure

```
src/
  components/   Layout, Nav (sticky + mobile overlay), Footer, AnnouncementBar,
                Placeholder, Field primitives, AvailabilityBar
  data/rooms.js Room catalogue (drives listing + detail pages)
  lib/          supabase.js (client), db.js (insert helper)
  pages/        one file per route
  index.css     design tokens + all component styles
supabase/schema.sql   database schema + RLS policies
```

## Notes

- **Images:** the design used diagonal-hatch placeholders where photography
  goes. `<Placeholder>` accepts a `src` prop — pass real image URLs to swap the
  hatch for photos, no other changes needed.
- **Image optimization:** drop photos into `public/` and they’re resized
  (max 2000px wide) and recompressed in place by `scripts/optimize-images.mjs`,
  which runs automatically before `npm run dev` and `npm run build` (or on
  demand via `npm run optimize:images`). Pristine originals are backed up to
  `public/.image-originals/` (git-ignored) so re-runs never degrade quality,
  and a manifest skips already-optimized files. Typical savings are 60–90%.
- **Map:** the Location page embeds Google Maps for Ipaja, Lagos (no API key
  needed). Swap the query in `src/pages/Location.jsx` for exact coordinates.

## Build

```bash
npm run build      # outputs to dist/
npm run preview     # preview the production build
```

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages). Set the
two `VITE_SUPABASE_*` variables in the host’s environment settings, and add a
SPA rewrite so client-side routes resolve (e.g. Netlify `_redirects`:
`/*  /index.html  200`).
