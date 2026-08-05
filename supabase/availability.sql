-- ============================================================================
-- Regnum Pavilion — room availability & stock
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER schema.sql. It adds per-room-type
-- stock and date-aware availability checking. Idempotent — safe to re-run.
--
-- Model: each room type has a `stock` (number of physical units). A date range
-- is available if  stock - (bookings whose dates OVERLAP that range) > 0.
-- Overlap rule: existing.check_in < requested.check_out
--           AND existing.check_out > requested.check_in
-- (a booking that ends before you arrive, or starts after you leave, is free).
--
-- Availability is computed inside SECURITY DEFINER functions so the public
-- (anon) key never has to read booking rows (which hold guests' names/emails);
-- the functions return only counts.
-- ============================================================================

-- 1. Room types + stock ------------------------------------------------------
create table if not exists public.room_types (
  slug   text primary key,
  name   text unique not null,          -- must match room_bookings.room_type
  stock  integer not null default 1 check (stock >= 0)
);

-- Seed / keep in sync. Adjust the stock numbers to the real unit counts.
insert into public.room_types (slug, name, stock) values
  ('standard-room',  'Standard Room',  10),
  ('deluxe-room',    'Deluxe Room',     6),
  ('pavilion-suite', 'Pavilion Suite',  3)
on conflict (slug) do nothing;

-- Room types are public, non-sensitive → anyone may read them.
alter table public.room_types enable row level security;
drop policy if exists "public can read room types" on public.room_types;
create policy "public can read room types" on public.room_types
  for select to anon, authenticated using (true);

-- Speeds up overlap counting as bookings grow.
create index if not exists room_bookings_type_dates_idx
  on public.room_bookings (room_type, check_in, check_out);

-- 2. Availability check (read-only, returns counts only) ---------------------
create or replace function public.check_room_availability(
  p_room_type text,
  p_check_in  date,
  p_check_out date
)
returns table (total integer, booked integer, available integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select rt.stock,
         b.cnt,
         greatest(rt.stock - b.cnt, 0)
  from public.room_types rt
  cross join lateral (
    select count(*)::int as cnt
    from public.room_bookings rb
    where rb.room_type = rt.name
      and coalesce(rb.status, 'new') <> 'cancelled'
      and rb.check_in is not null
      and rb.check_out is not null
      and rb.check_in  < p_check_out
      and rb.check_out > p_check_in
  ) b
  where rt.name = p_room_type;
end;
$$;

grant execute on function public.check_room_availability(text, date, date)
  to anon, authenticated;

-- 3. Atomic booking (re-checks under a lock, then inserts) -------------------
create or replace function public.book_room(
  p_room_type text,
  p_check_in  date,
  p_check_out date,
  p_guests    text,
  p_full_name text,
  p_email     text,
  p_phone     text default null,
  p_notes     text default null
)
returns table (ok boolean, available integer, message text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stock     int;
  v_booked    int;
  v_available int;
begin
  if p_check_in is null or p_check_out is null then
    return query select false, null::int, 'Please choose check-in and check-out dates.';
    return;
  end if;
  if p_check_out <= p_check_in then
    return query select false, null::int, 'Check-out must be after check-in.';
    return;
  end if;

  -- Lock this room type's row so concurrent bookings serialize (no overbooking).
  select rt.stock into v_stock
  from public.room_types rt
  where rt.name = p_room_type
  for update;

  if not found then
    return query select false, null::int, 'Unknown room type.';
    return;
  end if;

  select count(*)::int into v_booked
  from public.room_bookings rb
  where rb.room_type = p_room_type
    and coalesce(rb.status, 'new') <> 'cancelled'
    and rb.check_in is not null
    and rb.check_out is not null
    and rb.check_in  < p_check_out
    and rb.check_out > p_check_in;

  v_available := greatest(v_stock - v_booked, 0);

  if v_available <= 0 then
    return query select false, 0, 'Sorry, this room type is fully booked for those dates.';
    return;
  end if;

  insert into public.room_bookings
    (room_type, check_in, check_out, guests, full_name, email, phone, notes)
  values
    (p_room_type, p_check_in, p_check_out, p_guests, p_full_name, p_email, p_phone, p_notes);

  return query select true, v_available - 1, 'ok';
end;
$$;

grant execute on function public.book_room(text, date, date, text, text, text, text, text)
  to anon, authenticated;
