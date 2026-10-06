import { sendEmail } from './email'

// All data now goes through the Regnum reservations API (the staff app, backed
// by Neon Postgres). The browser never talks to the database directly.
//   VITE_API_BASE  e.g. https://staff.regnumpav.com   (no trailing slash)
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '')
export const isApiConfigured = Boolean(API_BASE)

const notConfiguredMessage =
  'The booking system isn’t connected yet. Set VITE_API_BASE to the reservations API URL.'

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  return { httpOk: res.ok, json }
}

// Central place every enquiry form submits through. Returns a plain result
// object so components can render success / error states without try/catch noise.
//
//   const { ok, error } = await insertInto('contact_messages', {...}, 'New message')
export async function insertInto(table, row, emailSubject) {
  if (!isApiConfigured) {
    console.info(`[Regnum] API not configured. Would submit to "${table}":`, row)
    return { ok: false, notConfigured: true, error: notConfiguredMessage }
  }
  try {
    const { httpOk, json } = await api(`/api/public/forms/${table}`, { method: 'POST', body: row })
    if (!httpOk) return { ok: false, error: json.error || 'Something went wrong. Please try again.' }
  } catch (err) {
    console.error(`[Regnum] Submit to "${table}" failed:`, err)
    return { ok: false, error: 'We couldn’t reach the server. Please try again.' }
  }
  // Fire-and-forget email so a failed notification never blocks the success UI.
  if (emailSubject) sendEmail(emailSubject, row)
  return { ok: true }
}

// Date-aware room availability (counts only). Returns e.g.
//   { ok: true, found: true, total: 6, available: 4 }
export async function checkRoomAvailability({ roomType, checkIn, checkOut }) {
  if (!isApiConfigured) return { ok: false, notConfigured: true, error: notConfiguredMessage }
  try {
    const q = new URLSearchParams({ room_type: roomType, check_in: checkIn, check_out: checkOut })
    const { httpOk, json } = await api(`/api/public/availability?${q}`)
    if (!httpOk) return { ok: false, error: json.error || 'Could not check availability.' }
    return { ok: true, found: json.found, total: json.total, available: json.available }
  } catch (err) {
    console.error('[Regnum] availability check failed:', err)
    return { ok: false, error: 'We couldn’t reach the server. Please try again.' }
  }
}

// Submits a booking. Two modes, decided by the server:
//   • Online payment live  → pass { payment_reference } (the Paystack reference of a deposit the guest
//     has just paid). The server verifies it with Paystack and creates the CONFIRMED reservation.
//   • Not live             → pass the booking details; saved as a PENDING request the front desk confirms.
//   → { ok, status: 'confirmed' | 'pending', reservationRef, message } or { ok: false, error, roomTaken }
export async function submitBooking(payload) {
  if (!isApiConfigured) return { ok: false, error: notConfiguredMessage }
  try {
    const { httpOk, json } = await api('/api/public/reservations', { method: 'POST', body: payload })
    if (!httpOk) return { ok: false, error: json.error || 'We couldn’t take your booking. Please try again.', roomTaken: json.code === 'ROOM_UNAVAILABLE' }
    return { ok: true, status: json.status, reservationRef: json.reference, message: json.message }
  } catch (err) {
    console.error('[Regnum] submitBooking failed:', err)
    return { ok: false, error: 'We couldn’t reach the server. Please try again.' }
  }
}
