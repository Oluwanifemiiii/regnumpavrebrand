// Small presentational form primitives sharing the underline field style.

export function Field({ label, name, type = 'text', value, onChange, placeholder, required, ...rest }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={name}>
          {label}
          {required && ' *'}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className="field-input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...rest}
      />
    </div>
  )
}

export function Textarea({ label, name, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={name}>
          {label}
          {required && ' *'}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        className="field-textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      />
    </div>
  )
}

export function Select({ label, name, value, onChange, options, required, placeholder }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={name}>
          {label}
          {required && ' *'}
        </label>
      )}
      <select
        id={name}
        name={name}
        className="field-select"
        value={value}
        onChange={onChange}
        required={required}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => {
          const val = typeof o === 'string' ? o : o.value
          const lbl = typeof o === 'string' ? o : o.label
          return (
            <option key={val} value={val}>
              {lbl}
            </option>
          )
        })}
      </select>
    </div>
  )
}

// Inline success / error message under a form.
export function FormStatus({ status }) {
  if (!status) return null
  const cls = status.ok ? 'ok' : 'err'
  return (
    <p className={`form-note ${cls}`} role="status">
      {status.message}
    </p>
  )
}
