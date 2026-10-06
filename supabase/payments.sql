-- ============================================================================
-- Regnum Pavilion — Paystack deposit payments for room bookings
-- ----------------------------------------------------------------------------
-- Run this in the Supabase SQL Editor AFTER schema.sql and availability.sql.
-- Idempotent — safe to re-run.
--
-- Why: room bookings now require a 50% deposit via Paystack before a booking
-- row is created (this deters spam bookings). Verifying the payment happens
-- server-side, in the /api/verify-paystack function, using the Paystack
-- secret key and the Supabase service_role key — neither of which may ever
-- reach the browser. So the public (anon) key must no longer be able to
-- create room bookings directly; only the service_role may, via book_room().
-- ============================================================================

-- 1. Payment columns on room_bookings -----------------------------------------
alter table public.room_bookings
  add column if not exists payment_reference text unique,
  add column if not exists deposit_amount integer,
  add column if not exists payment_status text not null default 'unpaid';

-- 2. Lock down direct inserts --------------------------------------------------
-- Bookings are now only created through book_room(), called by the server
-- with the service_role key after payment is verified.
drop policy if exists "public can insert" on public.room_bookings;

-- 3. book_room(): now payment-aware and idempotent on payment_reference -------
create or replace function public.book_room(
  p_room_type text,
  p_check_in  date,
  p_check_out date,
  p_guests    text,
  p_full_name text,
  p_email     text,
  p_phone     text default null,
  p_notes     text default null,
  p_payment_reference text default null,
  p_deposit_amount integer default null
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

  -- Idempotency: a retried verification for a reference we already booked
  -- should succeed quietly instead of erroring or double-booking.
  if p_payment_reference is not null
     and exists (
       select 1 from public.room_bookings
       where payment_reference = p_payment_reference
     )
  then
    return query select true, null::int, 'ok';
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
    (room_type, check_in, check_out, guests, full_name, email, phone, notes,
     payment_reference, deposit_amount, payment_status)
  values
    (p_room_type, p_check_in, p_check_out, p_guests, p_full_name, p_email, p_phone, p_notes,
     p_payment_reference, p_deposit_amount,
     case when p_payment_reference is not null then 'paid' else 'unpaid' end);

  return query select true, v_available - 1, 'ok';
end;
$$;

-- Only the server (service_role) may create bookings now — the anon key can
-- no longer call book_room() or insert into room_bookings directly.
revoke execute on function public.book_room(text, date, date, text, text, text, text, text, text, integer)
  from anon, authenticated, public;
grant execute on function public.book_room(text, date, date, text, text, text, text, text, text, integer)
  to service_role;
