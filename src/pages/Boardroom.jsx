import { useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import AvailabilityBar from '../components/AvailabilityBar.jsx'
import { Field, Select, Textarea, FormStatus } from '../components/Field.jsx'
import { insertInto } from '../lib/db'

const specs = [
  ['Capacity', 'Up to 20 seated'],
  ['Dimensions', '8m × 6m'],
  ['AV Equipment', 'Projector, 75" display, wireless presentation'],
  ['Internet', 'Dedicated high-speed Wi-Fi'],
  ['Catering', 'Available on request'],
  ['Natural Light', 'Floor-to-ceiling windows, blackout blinds'],
  ['Hourly Rate', '₦25,000 / hour'],
  ['Full-Day Rate', '₦150,000 / day'],
]

const addons = [
  ['Morning Refreshments', 'Coffee, tea, pastries, and fresh juice for all attendees.', '₦5,000'],
  ['Working Lunch', 'Three-course plated lunch served in the boardroom or restaurant.', '₦12,000'],
  ['Stationery Pack', 'Branded notepads, pens, and name cards for each attendee.', '₦3,000'],
]

export default function Boardroom() {
  const [form, setForm] = useState({
    booking_date: '',
    duration: '',
    attendees: '8',
    catering: 'No',
    full_name: '',
    email: '',
    notes: '',
  })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const res = await insertInto(
      'boardroom_bookings',
      {
        booking_date: form.booking_date || null,
        duration: form.duration || null,
        attendees: form.attendees ? Number(form.attendees) : null,
        catering: form.catering === 'Yes',
        full_name: form.full_name,
        email: form.email,
        notes: form.notes || null,
      },
      'New boardroom booking'
    )
    setBusy(false)
    if (res.ok) {
      setStatus({ ok: true, message: 'Booking submitted — we’ll confirm within 2 hours during business hours.' })
      setForm({ booking_date: '', duration: '', attendees: '8', catering: 'No', full_name: '', email: '', notes: '' })
    } else {
      setStatus({ ok: false, message: res.error })
    }
  }

  return (
    <>
      {/* Split hero */}
      <section className="split-hero">
        <div className="copy">
          <div className="eyebrow" style={{ marginBottom: 24 }}>
            The Boardroom
          </div>
          <h1 className="h1" style={{ fontSize: 'clamp(40px,5vw,60px)', marginBottom: 20 }}>
            A sanctuary
            <br />
            for focus.
          </h1>
          <p className="lead" style={{ maxWidth: 400, marginBottom: 36 }}>
            Not just a room with a projector. Natural light, premium AV, catering on call, and the
            privacy your meetings deserve.
          </p>
          <div className="btn-pair">
            <a href="#book" className="btn btn-primary">
              Book the Boardroom
            </a>
            <a href="#availability" className="btn btn-outline-soft">
              Check Availability
            </a>
          </div>
        </div>
        <Placeholder src="/boardroom.jpg" alt="Regnum Pavilion boardroom" tone="#d5cfc5" caption="boardroom — long table, natural light, clean setup" />
      </section>

      <div id="availability">
        <AvailabilityBar
          space="boardroom"
          style={{ margin: '60px var(--gutter) 0' }}
          fields={[
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'duration', label: 'Duration', type: 'select', options: ['Hourly', 'Half day', 'Full day'], placeholder: 'Duration' },
            { name: 'attendees', label: 'Attendees', type: 'number', placeholder: '8', min: 1 },
          ]}
        />
      </div>

      {/* Specs */}
      <section className="section">
        <div className="eyebrow mb-16">Specifications</div>
        <h2 className="h2 mb-48">Everything you need, nothing you don’t.</h2>
        <div className="spec-table">
          {specs.map(([k, v]) => (
            <div className="spec-row" key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          The Space
        </div>
        <div className="gallery-hero">
          <Placeholder className="main" style={{ aspectRatio: '16 / 10' }} src="/emptyboardroom.jpg" alt="Boardroom" tone="#ddd8ce" caption="boardroom — empty, showing scale and light" />
          <div className="side">
            <Placeholder src="/boardroomempty.jpg" alt="Boardroom" tone="#d5cfc5" caption="meeting in progress" />
            <Placeholder src="/boardroomdetail.jpg" alt="Boardroom AV detail" tone="#e0dbd3" caption="AV detail — screen, wireless setup" />
          </div>
        </div>
      </section>

      {/* Add-ons (dark) */}
      <section className="section dark-section">
        <div className="eyebrow mb-16">Add-ons</div>
        <h2 className="serif" style={{ fontSize: 36, color: 'var(--paper)', marginBottom: 48 }}>
          Customise your booking.
        </h2>
        <div className="addons">
          {addons.map(([name, desc, price]) => (
            <div className="addon" key={name}>
              <div className="name">{name}</div>
              <p>{desc}</p>
              <div className="price">
                {price} <small>/ person</small>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking form */}
      <section className="section" id="book">
        <div className="form-split">
          <div>
            <div className="eyebrow mb-16">Book</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              Reserve the
              <br />
              boardroom.
            </h2>
            <p className="lead">
              Confirmation within 2 hours during business hours. Same-day bookings subject to
              availability.
            </p>
          </div>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="form-row">
              <Field label="Date" name="booking_date" type="date" value={form.booking_date} onChange={set('booking_date')} />
              <Select label="Duration" name="duration" value={form.duration} onChange={set('duration')} placeholder="Select duration" options={['Hourly', 'Half day', 'Full day']} />
            </div>
            <div className="form-row">
              <Field label="Number of Attendees" name="attendees" type="number" min="1" value={form.attendees} onChange={set('attendees')} />
              <Select label="Catering Required" name="catering" value={form.catering} onChange={set('catering')} options={['No', 'Yes']} />
            </div>
            <div className="form-row">
              <Field label="Contact Name" name="full_name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <Textarea label="Additional Notes" name="notes" value={form.notes} onChange={set('notes')} placeholder="Special requirements, setup preferences…" />
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Submitting…' : 'Submit Booking'}
              </button>
              <FormStatus status={status} />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
