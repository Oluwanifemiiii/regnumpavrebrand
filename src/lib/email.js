// Email notifications via Web3Forms (https://web3forms.com).
//
// Web3Forms emails you the submission — no backend needed. The access key is
// designed to be public (it only lets a sender email YOUR inbox), so it lives
// in VITE_WEB3FORMS_KEY and is safe to ship in the client bundle.
//
// Email is best-effort: it runs AFTER a submission is already saved to the
// database, so a failed/again unconfigured email never blocks the user's
// success message.

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY
const ENDPOINT = 'https://api.web3forms.com/submit'

export const isEmailConfigured = Boolean(WEB3FORMS_KEY)

// Flatten a (possibly nested) submission object into simple key/value fields
// Web3Forms can render — e.g. availability's { space, details: {...} }.
function flatten(obj, out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, out)
    else out[k] = v ?? ''
  }
  return out
}

export async function sendEmail(subject, fields) {
  if (!WEB3FORMS_KEY) return { ok: false, skipped: true }
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject,
        from_name: 'Regnum Pavilion Website',
        ...flatten(fields),
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!json.success) {
      console.warn('[Regnum] email notification failed:', json)
      return { ok: false }
    }
    return { ok: true }
  } catch (err) {
    console.warn('[Regnum] email notification error:', err)
    return { ok: false }
  }
}
