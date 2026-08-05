import { supabase, isSupabaseConfigured } from './supabase'

const notConfiguredMessage =
  'The database isn’t connected yet. Add your Supabase keys to .env.local to start saving submissions.'

// Central place every form submits through. Returns a plain result object so
// components can render success / error states without try/catch noise.
//
//   const { ok, error } = await insertInto('contact_messages', {...})
//
export async function insertInto(table, row) {
  if (!isSupabaseConfigured) {
    // No backend yet — log the payload so the flow is testable locally, and
    // tell the user honestly rather than pretending it was saved.
    console.info(`[Regnum] Supabase not configured. Would insert into "${table}":`, row)
    return { ok: false, notConfigured: true, error: notConfiguredMessage }
  }

  // Insert only — we intentionally do NOT chain .select(), because the public
  // (anon) key is granted INSERT but not SELECT on these tables. Reading the
  // row back would require a SELECT policy and defeat that privacy design.
  const { error } = await supabase.from(table).insert(row)

  if (error) {
    console.error(`[Regnum] Insert into "${table}" failed:`, error)
    return { ok: false, error: friendlyError(error) }
  }

  return { ok: true }
}

// Date-aware room availability. Calls the `check_room_availability` SQL
// function, which returns only counts (never booking rows). Returns e.g.
//   { ok: true, found: true, total: 6, booked: 2, available: 4 }
export async function checkRoomAvailability({ roomType, checkIn, checkOut }) {
  if (!isSupabaseConfigured) {
    return { ok: false, notConfigured: true, error: notConfiguredMessage }
  }
  const { data, error } = await supabase.rpc('check_room_availability', {
    p_room_type: roomType,
    p_check_in: checkIn,
    p_check_out: checkOut,
  })
  if (error) {
    console.error('[Regnum] check_room_availability failed:', error)
    return { ok: false, error: friendlyError(error) }
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row) return { ok: true, found: false }
  return { ok: true, found: true, total: row.total, booked: row.booked, available: row.available }
}

// Atomic room booking via the `book_room` SQL function: it re-checks
// availability under a lock and inserts only if a unit is free, so the site
// can never overbook. Returns { ok, available, message }.
export async function bookRoom(payload) {
  if (!isSupabaseConfigured) {
    return { ok: false, notConfigured: true, error: notConfiguredMessage }
  }
  const { data, error } = await supabase.rpc('book_room', {
    p_room_type: payload.room_type,
    p_check_in: payload.check_in,
    p_check_out: payload.check_out,
    p_guests: payload.guests ?? null,
    p_full_name: payload.full_name,
    p_email: payload.email,
    p_phone: payload.phone ?? null,
    p_notes: payload.notes ?? null,
  })
  if (error) {
    console.error('[Regnum] book_room failed:', error)
    return { ok: false, error: friendlyError(error) }
  }
  const row = Array.isArray(data) ? data[0] : data
  return { ok: row?.ok === true, available: row?.available, message: row?.message }
}

// Turn Postgres/PostgREST errors into something a visitor can read.
function friendlyError(error) {
  if (error.code === '42501') {
    return 'Submission was blocked by the database. (Run the RLS policies from supabase/schema.sql.)'
  }
  // Availability/booking function not created yet.
  if (error.code === 'PGRST202' || /Could not find the function/i.test(error.message || '')) {
    return 'Availability isn’t set up yet. (Run supabase/availability.sql in the Supabase SQL editor.)'
  }
  return error.message || 'Something went wrong. Please try again.'
}
