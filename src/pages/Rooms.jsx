import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'
import AvailabilityBar from '../components/AvailabilityBar.jsx'
import { rooms, naira } from '../data/rooms.js'
import { checkRoomAvailability } from '../lib/db'
import { todayISO } from '../lib/dates'

export default function Rooms() {
  // Runs the real, date-aware stock check for the Rooms availability bar.
  const checkAvailability = async (v) => {
    if (!v.room_type) return { ok: false, message: 'Please choose a room type.' }
    if (!v.check_in || !v.check_out)
      return { ok: false, message: 'Please choose check-in and check-out dates.' }
    if (v.check_in < todayISO())
      return { ok: false, message: 'Check-in can’t be in the past. Please choose today or a later date.' }
    if (v.check_out <= v.check_in)
      return { ok: false, message: 'Check-out must be after check-in.' }

    const res = await checkRoomAvailability({
      roomType: v.room_type,
      checkIn: v.check_in,
      checkOut: v.check_out,
    })
    if (!res.ok) return { ok: false, message: res.error }
    if (!res.found) return { ok: false, message: 'That room type wasn’t found.' }
    if (res.available <= 0)
      return { ok: false, message: `Sorry, the ${v.room_type} is fully booked for those dates.` }

    const unit = res.available === 1 ? 'room' : 'rooms'
    return {
      ok: true,
      message: `Good news — ${res.available} ${unit} available for your dates. Pick a room below to book.`,
    }
  }

  return (
    <>
      <header className="page-header">
        <div className="eyebrow">Accommodation</div>
        <h1 className="h1">Your room is ready.</h1>
        <p className="lead">
          Four room types, each designed for comfort and quiet. All rates include breakfast and
          Wi-Fi.
        </p>
      </header>

      <AvailabilityBar
        space="rooms"
        style={{ margin: '0 var(--gutter) 80px' }}
        onCheck={checkAvailability}
        fields={[
          {
            name: 'room_type',
            label: 'Room type',
            type: 'select',
            options: rooms.map((r) => r.name),
            placeholder: 'Any room',
          },
          { name: 'check_in', label: 'Check-in', type: 'date' },
          { name: 'check_out', label: 'Check-out', type: 'date' },
          {
            name: 'guests',
            label: 'Guests',
            type: 'select',
            options: ['1 Adult', '2 Adults', '2 Adults, 1 Child', '3 Adults', 'Family (4+)'],
            placeholder: 'Guests',
          },
        ]}
      />

      {rooms.map((room, i) => {
        const reverse = i % 2 === 1
        const image = (
          <Placeholder
            src={room.img}
            alt={room.name}
            tone={room.tone}
            caption={`${room.name.toLowerCase()} — natural light, warm tones`}
          />
        )
        const copy = (
          <div>
            <div className="eyebrow-muted mb-16">{room.index}</div>
            <h2 className="serif" style={{ fontSize: 40, margin: '0 0 12px' }}>
              {room.name}
            </h2>
            <p className="lead" style={{ maxWidth: 360 }}>
              {room.blurb}
            </p>
            <div className="room-mini-specs">
              {['Size', 'Occupancy', 'Bed'].map((k) => (
                <div className="spec-row" key={k}>
                  <span className="k">{k}</span>
                  <span className="v">{room.specs[k]}</span>
                </div>
              ))}
            </div>
            <div className="price-line">
              <span className="amt">{naira(room.price)}</span>
              <span className="per">/ night</span>
            </div>
            <div className="btn-pair">
              <Link to={`/rooms/${room.slug}`} className="btn btn-primary">
                Book This Room
              </Link>
              <Link to={`/rooms/${room.slug}`} className="btn btn-outline-soft">
                View Details
              </Link>
            </div>
          </div>
        )
        return (
          <div key={room.slug}>
            <section className="section">
              <div className={`room-row ${reverse ? 'reverse' : ''}`}>
                {reverse ? (
                  <>
                    {copy}
                    {image}
                  </>
                ) : (
                  <>
                    {image}
                    {copy}
                  </>
                )}
              </div>
            </section>
            {i < rooms.length - 1 && <div className="divider-rule" />}
          </div>
        )
      })}

      {/* Good to know */}
      <section className="section">
        <div style={{ padding: 40, border: '1px solid var(--divider-soft)' }}>
          <div className="eyebrow-muted mb-16">Good to Know</div>
          <div className="directions" style={{ gap: 32 }}>
            <div style={{ borderTop: 'none', paddingTop: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                Check-in / Check-out
              </div>
              <p className="lead" style={{ fontSize: 13 }}>
                Check-in from 2:00 PM
                <br />
                Check-out by 12:00 PM
              </p>
            </div>
            <div style={{ borderTop: 'none', paddingTop: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Included</div>
              <p className="lead" style={{ fontSize: 13 }}>
                Breakfast, Wi-Fi, parking,
                <br />
                access to pool &amp; gym
              </p>
            </div>
            <div style={{ borderTop: 'none', paddingTop: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Cancellation</div>
              <p className="lead" style={{ fontSize: 13 }}>
                Free cancellation up to 48 hours
                <br />
                before check-in
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
