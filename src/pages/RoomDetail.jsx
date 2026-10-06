import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import { Field, Select, FormStatus } from '../components/Field.jsx'
import { getRoom, naira } from '../data/rooms.js'
import { checkRoomAvailability, submitBooking } from '../lib/db'
import { isPaystackConfigured, payWithPaystack } from '../lib/paystack'
import { addDays, todayISO } from '../lib/dates'
import NotFound from './NotFound.jsx'

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn)
  return Math.round(ms / 86400000)
}

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
  // Live "rooms left" for the chosen dates, so nobody pays for a room that is gone.
  const [avail, setAvail] = useState(null) // null = unknown / not asked yet

  useEffect(() => {
    if (!room || !form.check_in || !form.check_out || form.check_out <= form.check_in) { setAvail(null); return }
    let stale = false
    const t = setTimeout(async () => {
      const res = await checkRoomAvailability({ roomType: room.name, checkIn: form.check_in, checkOut: form.check_out })
      if (!stale) setAvail(res.ok && res.found ? { available: res.available, total: res.total } : { unknown: true })
    }, 300)
    return () => { stale = true; clearTimeout(t) }
  }, [room, form.check_in, form.check_out])

  if (!room) return <NotFound />

  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const nights = form.check_in && form.check_out && form.check_out > form.check_in
    ? nightsBetween(form.check_in, form.check_out)
    : 0
  const deposit = nights > 0 ? Math.round((room.price * nights) / 2) : 0

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.check_in || !form.check_out) {
      setStatus({ ok: false, message: 'Please choose check-in and check-out dates.' })
      return
    }
    if (form.check_in < todayISO()) {
      setStatus({ ok: false, message: 'Check-in can’t be in the past. Please choose today or a later date.' })
      return
    }
    if (form.check_out <= form.check_in) {
      setStatus({ ok: false, message: 'Check-out must be after check-in.' })
      return
    }
    setBusy(true)
    setStatus(null)

    const booking = {
      room_type: room.name,
      check_in: form.check_in,
      check_out: form.check_out,
      guests: form.guests,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone || null,
    }

    // Re-check availability right before taking money: the count on screen may be stale.
    const fresh = await checkRoomAvailability({ roomType: room.name, checkIn: form.check_in, checkOut: form.check_out })
    if (!fresh.ok) {
      setBusy(false)
      setStatus({ ok: false, message: fresh.error })
      return
    }
    if (fresh.found && fresh.available <= 0) {
      setAvail({ available: 0, total: fresh.total })
      setBusy(false)
      setStatus({ ok: false, message: `Sorry, the ${room.name} was just booked for those dates. Please choose different dates or another room.` })
      return
    }

    const finish = (res) => {
      setBusy(false)
      if (res.ok && res.status === 'confirmed') {
        setStatus({ ok: true, message: 'Payment received — your booking is confirmed. Check your email for details.' })
      } else if (res.ok) {
        setStatus({ ok: true, message: res.message || 'Your request has been received. Our front desk will confirm it shortly.' })
      } else {
        setStatus({ ok: false, message: res.error })
        if (res.roomTaken) setAvail({ available: 0 })
        return
      }
      setForm((f) => ({ ...f, full_name: '', email: '', phone: '' }))
    }

    // Online payment isn't switched on yet: save a pending request for the front desk to confirm.
    if (!isPaystackConfigured) {
      finish(await submitBooking({ ...booking, notes: null }))
      return
    }

    // A 50% deposit is charged up front via Paystack. The booking details ride along in the
    // transaction metadata, so the server can create the booking even if this tab is closed
    // right after paying (the Paystack webhook does it too). The room is only booked once the
    // server has verified the payment.
    try {
      await payWithPaystack({
        email: form.email,
        amountKobo: deposit * 100,
        metadata: { booking },
        onSuccess: async (reference) => finish(await submitBooking({ payment_reference: reference })),
        onClose: () => {
          setBusy(false)
          setStatus((s) => s ?? { ok: false, message: 'Payment window closed — your booking wasn’t completed.' })
        },
      })
    } catch (err) {
      setBusy(false)
      setStatus({ ok: false, message: err.message || 'Something went wrong starting payment.' })
    }
  }

  return (
    <>
      <div className="breadcrumb">
        <Link to="/rooms">Rooms</Link>
        <span className="sep">—</span>
        <span className="current">{room.name}</span>
      </div>

      {/* Gallery — bento grid */}
      <section style={{ padding: '0 var(--gutter)' }}>
        <div className="room-bento">
          {(room.gallery || [room.img, room.bathroom, room.sittingArea]).slice(0, 5).map((src, i) => (
            <Placeholder key={src} src={src} alt={`${room.name} — view ${i + 1}`} tone={room.tone} />
          ))}
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
            <Field label="Check-in" name="check_in" type="date" value={form.check_in} onChange={set('check_in')} required />
            <Field label="Check-out" name="check_out" type="date" min={addDays(form.check_in || todayISO(), 1)} value={form.check_out} onChange={set('check_out')} required />
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
            {avail && !avail.unknown && (
              <p className="lead" style={{ fontSize: 13, marginTop: 4 }} role="status">
                {avail.available === 0
                  ? <strong>Fully booked for these dates. Please try different dates.</strong>
                  : avail.available <= 3
                    ? <><strong>Only {avail.available} {avail.available === 1 ? 'room' : 'rooms'} left</strong> for your dates.</>
                    : <>{avail.available} rooms available for your dates.</>}
              </p>
            )}
            {deposit > 0 && (
              <p className="lead" style={{ fontSize: 12, marginTop: 4 }}>
                {isPaystackConfigured
                  ? <>Pay a 50% deposit of <strong>{naira(deposit)}</strong> now via Paystack to secure this booking</>
                  : <>A 50% deposit of <strong>{naira(deposit)}</strong> will be requested by our front desk to secure this booking</>}{' '}
                ({nights} {nights === 1 ? 'night' : 'nights'}, {naira(room.price * nights)} total).
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={busy || avail?.available === 0} style={{ marginTop: 8 }}>
              {busy ? 'Processing…' : avail?.available === 0 ? 'Fully booked for these dates' : isPaystackConfigured ? 'Pay Deposit & Book' : 'Request Booking'}
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
