import { supabase, isSupabaseConfigured } from './supabase'

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
    return {
      ok: false,
      notConfigured: true,
      error:
        'The database isn’t connected yet. Add your Supabase keys to .env.local to start saving submissions.',
    }
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

// Turn Postgres/PostgREST errors into something a visitor can read.
function friendlyError(error) {
  if (error.code === '42501') {
    return 'Submission was blocked by the database. (Run the RLS policies from supabase/schema.sql.)'
  }
  return error.message || 'Something went wrong. Please try again.'
}
