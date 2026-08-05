import { useState } from 'react'
import { insertInto } from '../lib/db'

// The dark inline "Check Availability" widget used on Rooms, Restaurant,
// Boardroom and Event Hall. Captures a lightweight lead into
// `availability_requests` (space + details as JSON).
// `onCheck(values) => Promise<{ ok, message }>` — when provided (e.g. the Rooms
// bar, which checks real stock/dates), it runs instead of the default
// lead-capture insert.
export default function AvailabilityBar({
  space,
  fields,
  buttonLabel = 'Check Availability',
  onCheck,
  style,
}) {
  const initial = Object.fromEntries(fields.map((f) => [f.name, f.default ?? '']))
  const [values, setValues] = useState(initial)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  const update = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    let result
    if (onCheck) {
      result = await onCheck(values)
    } else {
      const res = await insertInto('availability_requests', { space, details: values })
      result = res.ok
        ? { ok: true, message: 'Thanks — we’ll confirm availability by email shortly.' }
        : { ok: false, message: res.error }
    }
    setBusy(false)
    setStatus(result)
  }

  return (
    <div style={style}>
      <form className="availability" onSubmit={onSubmit}>
        {fields.map((f) => (
          <div className="field" key={f.name}>
            <label className="field-label" htmlFor={`av-${space}-${f.name}`}>
              {f.label}
            </label>
            {f.type === 'select' ? (
              <select
                id={`av-${space}-${f.name}`}
                className="field-select"
                value={values[f.name]}
                onChange={update(f.name)}
              >
                <option value="" disabled>
                  {f.placeholder || 'Select'}
                </option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`av-${space}-${f.name}`}
                type={f.type || 'text'}
                className="field-input"
                value={values[f.name]}
                onChange={update(f.name)}
                placeholder={f.placeholder}
                min={f.min}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-bronze" disabled={busy}>
          {busy ? 'Checking…' : buttonLabel}
        </button>
      </form>
      {status && (
        <p
          className={`form-note ${status.ok ? 'ok' : 'err'}`}
          style={{ color: status.ok ? 'var(--bronze)' : '#e0a0a0', padding: '10px 0 0' }}
          role="status"
        >
          {status.message}
        </p>
      )}
    </div>
  )
}
