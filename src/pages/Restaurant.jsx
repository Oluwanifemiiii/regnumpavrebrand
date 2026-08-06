import { useState } from 'react'
import Placeholder from '../components/Placeholder.jsx'
import AvailabilityBar from '../components/AvailabilityBar.jsx'
import { Field, Select, Textarea, FormStatus } from '../components/Field.jsx'
import { insertInto } from '../lib/db'

const menu = [
  {
    cat: 'Starters',
    items: [
      ['Peppered Snail', 'spiced, grilled, served with plantain crisps'],
      ['Suya-Spiced Prawns', 'chargrilled, yaji butter, micro greens'],
      ['Gizdodo Skewers', 'gizzard, fried plantain, bell pepper glaze'],
    ],
  },
  {
    cat: 'Mains',
    items: [
      ['Jollof Risotto', 'smoked tomato, crayfish, parmesan crisp'],
      ['Grilled Sea Bass', 'ofada sauce, steamed greens, coconut rice'],
      ['Slow-Braised Short Rib', 'red wine reduction, yam purée, roasted root vegetables'],
    ],
  },
  {
    cat: 'Desserts',
    items: [
      ['Coconut Panna Cotta', 'passion fruit coulis, toasted coconut'],
      ['Chin Chin Tiramisu', 'spiced chin chin layers, espresso cream'],
    ],
  },
  {
    cat: 'Drinks',
    items: [
      ['Chapman Royale', 'our signature, with bitters and citrus'],
      ['Palm Wine Spritz', 'fresh palm wine, elderflower, soda'],
    ],
  },
]

const hours = [
  ['Monday – Friday', '7 AM – 10 PM'],
  ['Saturday', '8 AM – 11 PM'],
  ['Sunday', '8 AM – 9 PM'],
]

export default function Restaurant() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    guests: '2',
    reserved_date: '',
    reserved_time: '',
    special_requests: '',
  })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const res = await insertInto(
      'restaurant_reservations',
      {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        guests: form.guests ? Number(form.guests) : null,
        reserved_date: form.reserved_date || null,
        reserved_time: form.reserved_time || null,
        special_requests: form.special_requests || null,
      },
      'New restaurant reservation'
    )
    setBusy(false)
    if (res.ok) {
      setStatus({ ok: true, message: 'Table request received — we’ll confirm your reservation by email.' })
      setForm({ full_name: '', email: '', phone: '', guests: '2', reserved_date: '', reserved_time: '', special_requests: '' })
    } else {
      setStatus({ ok: false, message: res.error })
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bleed-hero">
        <Placeholder src="/restaurant.jpg" alt="Regnum Pavilion restaurant" tone="#c9c3b8" caption="restaurant interior — warm lighting, table setting, golden hour ambiance" />
        <div className="overlay">
          <div className="eyebrow mb-16">The Restaurant</div>
          <h1 className="hero-title" style={{ fontSize: 'clamp(40px,6vw,68px)' }}>
            Where flavour
            <br />
            meets occasion.
          </h1>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="intro-grid">
          <p className="big">
            A menu rooted in Nigerian tradition, sharpened with continental technique. Whether you’re
            a hotel guest or visiting for the evening, the table is set for you.
          </p>
          <div>
            <p style={{ marginBottom: 24 }}>
              Our kitchen brings together the bold, layered flavours of Nigerian cuisine with the
              precision and presentation of continental dining. Seasonal ingredients, house-made
              sauces, and plates designed to be shared — or savoured alone.
            </p>
            <p>
              Open daily for breakfast, lunch, and dinner. Reservations recommended for evenings and
              weekends.
            </p>
          </div>
        </div>
      </section>

      <AvailabilityBar
        space="restaurant"
        style={{ margin: '0 var(--gutter)' }}
        fields={[
          { name: 'date', label: 'Date', type: 'date' },
          { name: 'time', label: 'Time', type: 'time' },
          { name: 'guests', label: 'Guests', type: 'number', placeholder: '2', min: 1 },
        ]}
      />

      {/* Menu teaser */}
      <section className="section">
        <div className="eyebrow mb-16">From the Menu</div>
        <h2 className="h2 mb-48">A taste of what awaits.</h2>
        <div className="menu-grid">
          {menu.map((group, i) => (
            <div className={`menu-col ${i >= 2 ? 'top-border' : ''}`} key={group.cat}>
              <div className="cat">{group.cat}</div>
              {group.items.map(([name, desc]) => (
                <div className="dish" key={name}>
                  <div className="name">{name}</div>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Image break */}
      <div style={{ margin: '0 20px', height: '50vh', minHeight: 320 }}>
        <Placeholder
          src="/plateddish.jpg"
          alt="Signature plated dish"
          tone="#d5cfc5"
          style={{ height: '100%' }}
          caption="plated dish — close-up, dramatic lighting, chef’s presentation"
        />
      </div>

      {/* Reservation form */}
      <section className="section">
        <div className="form-split">
          <div>
            <div className="eyebrow mb-16">Reserve</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              Book your table.
            </h2>
            <p className="lead" style={{ marginBottom: 40 }}>
              Walk-ins welcome, but we recommend booking for evenings and weekends to guarantee your
              preferred time.
            </p>
            <div className="eyebrow-muted" style={{ marginBottom: 20 }}>
              Opening Hours
            </div>
            <div className="hours-list">
              {hours.map(([d, t]) => (
                <div className="spec-row" key={d}>
                  <span className="k">{d}</span>
                  <span className="v">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="form-row">
              <Field label="Full Name" name="full_name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <div className="form-row">
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+234" />
              <Field label="Number of Guests" name="guests" type="number" min="1" value={form.guests} onChange={set('guests')} />
            </div>
            <div className="form-row">
              <Field label="Date" name="reserved_date" type="date" value={form.reserved_date} onChange={set('reserved_date')} />
              <Field label="Preferred Time" name="reserved_time" type="time" value={form.reserved_time} onChange={set('reserved_time')} />
            </div>
            <Textarea
              label="Special Requests"
              name="special_requests"
              value={form.special_requests}
              onChange={set('special_requests')}
              placeholder="Dietary requirements, celebrations, seating preferences…"
            />
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Sending…' : 'Reserve a Table'}
              </button>
              <FormStatus status={status} />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
