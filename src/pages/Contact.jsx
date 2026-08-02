import { useState } from 'react'
import { Field, Select, Textarea, FormStatus } from '../components/Field.jsx'
import { insertInto } from '../lib/db'

const departments = [
  ['Reservations', 'Room bookings & accommodation', 'reservations@regnumpavilion.com', '+234 801 234 5678'],
  ['Events', 'Event hall & boardroom bookings', 'events@regnumpavilion.com', '+234 801 234 5679'],
  ['Restaurant', 'Table reservations & dining inquiries', 'dining@regnumpavilion.com', '+234 801 234 5680'],
  ['General', 'Everything else & general inquiries', 'hello@regnumpavilion.com', '+234 801 234 5670'],
]

export default function Contact() {
  const [form, setForm] = useState({ full_name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const res = await insertInto('contact_messages', {
      full_name: form.full_name,
      email: form.email,
      subject: form.subject || null,
      message: form.message,
    })
    setBusy(false)
    if (res.ok) {
      setStatus({ ok: true, message: 'Message sent — we’ll respond within 24 hours on business days.' })
      setForm({ full_name: '', email: '', subject: '', message: '' })
    } else {
      setStatus({ ok: false, message: res.error })
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="eyebrow" style={{ marginBottom: 24 }}>
          Contact
        </div>
        <h1 className="h1">Get in touch.</h1>
        <p className="lead" style={{ maxWidth: 440 }}>
          Reach the right team directly — or send a general inquiry and we’ll route it for you.
        </p>
      </header>

      {/* Department cards */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="dept-grid">
          {departments.map(([label, title, email, phone]) => (
            <div className="dept" key={label}>
              <div className="eyebrow" style={{ letterSpacing: '0.15em' }}>
                {label}
              </div>
              <div className="serif">{title}</div>
              <div className="line">
                <span className="k">Email</span>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
              <div className="line">
                <span className="k">Phone</span>
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message form */}
      <section className="section" style={{ borderTop: '1px solid var(--divider-soft)' }}>
        <div className="form-split">
          <div>
            <div className="eyebrow mb-16">Write to Us</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              Send a message.
            </h2>
            <p className="lead">We’ll respond within 24 hours during business days.</p>
          </div>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="form-row">
              <Field label="Full Name" name="full_name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <Select
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={set('subject')}
              placeholder="Select a subject"
              options={['Room Booking', 'Event Inquiry', 'Restaurant', 'Boardroom', 'Other']}
            />
            <Textarea label="Message" name="message" value={form.message} onChange={set('message')} placeholder="How can we help?" rows={4} required />
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Sending…' : 'Send Message'}
              </button>
              <FormStatus status={status} />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
