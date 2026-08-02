import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import { Field, Select, FormStatus } from '../components/Field.jsx'
import { getRoom, naira } from '../data/rooms.js'
import { insertInto } from '../lib/db'
import NotFound from './NotFound.jsx'

export default function RoomDetail() {
  const { slug } = useParams()
  const room = getRoom(slug)

  const [form, setForm] = useState({
    check_in: '',
    check_out: '',
    guests: '2 Adults',
    full_name: '',
    email: '',
    phone: '',
  })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!room) return <NotFound />

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const res = await insertInto('room_bookings', {
      room_type: room.name,
      check_in: form.check_in || null,
      check_out: form.check_out || null,
      guests: form.guests,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
    })
    setBusy(false)
    if (res.ok) {
      setStatus({ ok: true, message: 'Booking request received — we’ll confirm by email shortly.' })
      setForm((f) => ({ ...f, full_name: '', email: '', phone: '' }))
    } else {
      setStatus({ ok: false, message: res.error })
    }
  }

  return (
    <>
      <div className="breadcrumb">
        <Link to="/rooms">Rooms</Link>
        <span className="sep">—</span>
        <span className="current">{room.name}</span>
      </div>

      {/* Gallery */}
      <section style={{ padding: '0 var(--gutter)' }}>
        <div className="gallery-hero">
          <Placeholder className="main" src={room.img} alt={room.name} tone={room.tone} caption={`${room.name.toLowerCase()} — hero shot, wide angle`} />
          <div className="side">
            <Placeholder src={room.bathroom} alt={`${room.name} bathroom`} tone="#d5cfc5" caption="bathroom detail" />
            <Placeholder src={room.sittingArea} alt={`${room.name} sitting area`} tone="#e0dbd3" caption="sitting area — window view" />
          </div>
        </div>
      </section>

      {/* Content + sticky booking card */}
      <section className="section">
        <div className="detail-layout">
          <div>
            <h1 className="h1" style={{ fontSize: 48, marginBottom: 16 }}>
              {room.name}
            </h1>
            <p className="lead" style={{ fontSize: 15, lineHeight: 1.8, maxWidth: 540, marginBottom: 48 }}>
              {room.longDescription}
            </p>

            <div className="eyebrow-muted mb-16">Room Details</div>
            <div className="spec-table">
              {Object.entries(room.specs).map(([k, v]) => (
                <div className="spec-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{v}</span>
                </div>
              ))}
            </div>

            <div className="eyebrow-muted mt-48 mb-16">Amenities</div>
            <div className="amenity-grid">
              {room.amenities.map((a) => (
                <span key={a}>{a}</span>
              ))}
            </div>

            <div className="eyebrow-muted mt-48 mb-16">Policies</div>
            <div className="form-row" style={{ gap: 16 }}>
              {[
                ['Check-in', 'From 2:00 PM'],
                ['Check-out', 'By 12:00 PM'],
                ['Cancellation', 'Free up to 48 hours before check-in'],
                ['Breakfast', 'Included for all guests'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <p className="lead" style={{ fontSize: 13 }}>
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking card */}
          <form className="booking-card" onSubmit={onSubmit}>
            <div className="price-line">
              <span className="amt">{naira(room.price)}</span>
              <span className="per">/ night</span>
            </div>
            <Field label="Check-in" name="check_in" type="date" value={form.check_in} onChange={set('check_in')} />
            <Field label="Check-out" name="check_out" type="date" value={form.check_out} onChange={set('check_out')} />
            <Select
              label="Guests"
              name="guests"
              value={form.guests}
              onChange={set('guests')}
              options={['1 Adult', '2 Adults', '2 Adults, 1 Child', '3 Adults']}
            />
            <Field label="Full name" name="full_name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" required />
            <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+234" />
            <button type="submit" className="btn btn-primary btn-block" disabled={busy} style={{ marginTop: 8 }}>
              {busy ? 'Sending…' : 'Book Now'}
            </button>
            <FormStatus status={status} />
            <p className="lead" style={{ fontSize: 11, textAlign: 'center', marginTop: 16 }}>
              Free cancellation up to 48 hours before check-in
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
