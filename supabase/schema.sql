-- ============================================================================
-- Regnum Pavilion — database schema
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- against a fresh project. It creates one table per public form and enables
-- Row Level Security so the anonymous (public) key can INSERT submissions but
-- cannot read anyone else's data. Reading submissions is left to authenticated
-- staff / the service_role key (used server-side or in the dashboard).
-- ============================================================================

-- Helpful enum-like check constraints are used instead of Postgres enums so the
-- app can evolve option lists without a migration.

-- ---------------------------------------------------------------------------
-- 1. Contact messages  (Contact page → "Send a message")
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  full_name   text not null,
  email       text not null,
  subject     text,
  message     text not null
);

-- ---------------------------------------------------------------------------
-- 2. Room bookings  (Rooms listing / Room detail → "Book this room")
-- ---------------------------------------------------------------------------
create table if not exists public.room_bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  room_type   text not null,               -- Standard Room / Deluxe Room / Pavilion Suite
  check_in    date,
  check_out   date,
  guests      text,                         -- e.g. "2 Adults"
  full_name   text not null,
  email       text not null,
  phone       text,
  notes       text,
  status      text not null default 'new'
);

-- ---------------------------------------------------------------------------
-- 3. Restaurant reservations  (Restaurant → "Reserve a table")
-- ---------------------------------------------------------------------------
create table if not exists public.restaurant_reservations (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  full_name     text not null,
  email         text not null,
  phone         text,
  guests        integer,
  reserved_date date,
  reserved_time text,
  special_requests text,
  status        text not null default 'new'
);

-- ---------------------------------------------------------------------------
-- 4. Boardroom bookings  (Boardroom → "Submit booking")
-- ---------------------------------------------------------------------------
create table if not exists public.boardroom_bookings (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  booking_date  date,
  duration      text,                       -- Hourly / Half day / Full day
  attendees     integer,
  catering      boolean default false,
  full_name     text not null,
  email         text not null,
  notes         text,
  status        text not null default 'new'
);

-- ---------------------------------------------------------------------------
-- 5. Event enquiries  (Event Hall → "Submit inquiry")
-- ---------------------------------------------------------------------------
create table if not exists public.event_enquiries (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  full_name      text not null,
  email          text not null,
  phone          text,
  event_type     text,
  preferred_date date,
  expected_guests integer,
  message        text,
  status         text not null default 'new'
);

-- ---------------------------------------------------------------------------
-- 6. Availability requests  (the dark "Check Availability" search bars)
--    A lightweight lead capture from the inline availability widgets.
-- ---------------------------------------------------------------------------
create table if not exists public.availability_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  space       text not null,                -- rooms / restaurant / boardroom / events
  details     jsonb not null default '{}'::jsonb
);

-- ============================================================================
-- Row Level Security
-- ----------------------------------------------------------------------------
-- Enable RLS AND create the public INSERT policy for every table in one loop,
-- so a partial run can't leave a table with RLS on but no policy (which would
-- reject every submission with error 42501). Anyone may submit a form; nobody
-- gets read/update/delete via the public key — review submissions in the
-- dashboard or with an authenticated staff role.
--
-- Idempotent: safe to run as many times as you like.
-- ============================================================================
do $$
declare
  t text;
begin
  foreach t in array array[
    'contact_messages',
    'room_bookings',
    'restaurant_reservations',
    'boardroom_bookings',
    'event_enquiries',
    'availability_requests'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "public can insert" on public.%I;', t);
    execute format(
      'create policy "public can insert" on public.%I for insert to anon, authenticated with check (true);',
      t
    );
  end loop;
end $$;

-- ============================================================================
-- Room availability & stock lives in a separate file so it can be re-run on
-- its own. After this schema, also run:  supabase/availability.sql
-- ============================================================================
