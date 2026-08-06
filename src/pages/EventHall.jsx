import { useState } from 'react'
import Placeholder from '../components/Placeholder.jsx'
import AvailabilityBar from '../components/AvailabilityBar.jsx'
import { Field, Select, Textarea, FormStatus } from '../components/Field.jsx'
import { insertInto } from '../lib/db'

const eventTypes = [
  ['Weddings', 'From intimate ceremonies to grand receptions.'],
  ['Corporate Events', 'Conferences, retreats, annual dinners.'],
  ['Product Launches', 'Full AV, staging, and a captive audience.'],
  ['Private Dinners', 'Exclusive dining for smaller gatherings.'],
  ['Award Ceremonies', 'Stage, lights, and a room that rises to the occasion.'],
  ['Birthday Celebrations', 'Milestone parties done properly.'],
]

const pastEvents = [
  ['The Okafor-Balogun Wedding', '350 guests · Banquet setup · June 2026', '#ddd8ce', 'wedding — dance floor', '/weddingpicture.jpg'],
  ['TechLagos Annual Summit', '480 guests · Theatre setup · March 2026', '#d5cfc5', 'corporate — keynote stage', '/techsummit.jpg'],
  ['Ndani Beauty Launch', '200 guests · Cocktail setup · January 2026', '#e0dbd3', 'product launch — cocktail', '/beautyproductlaunch.jpg'],
]

const venueSpecs = [
  ['Total Area', '800 sqm', false],
  ['Ceiling Height', '6 metres', false],
  ['Max Capacity', '500 guests', false],
  ['AV Equipment', 'Projectors, PA system, wireless mics, stage lighting', true],
  ['Catering', 'In-house kitchen, custom menus, bar service available', true],
  ['Parking', 'On-site parking for 80+ vehicles', true],
]

// Compact seating-layout glyphs (echoing the design's dot diagrams).
function ConfigGlyph({ kind }) {
  if (kind === 'banquet') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(250,248,245,.25)' }}
          />
        ))}
      </div>
    )
  }
  if (kind === 'cocktail') {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 60 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="dot" style={{ width: 4, height: 4, opacity: 0.4 + (i % 4) * 0.15 }} />
        ))}
      </div>
    )
  }
  if (kind === 'classroom') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((c) => (
              <div key={c} style={{ width: 20, height: 3, background: `rgba(250,248,245,${0.2 + r * 0.05})` }} />
            ))}
          </div>
        ))}
        <div style={{ width: 30, height: 2, background: 'var(--bronze)', marginTop: 6 }} />
      </div>
    )
  }
  // theatre
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
      {[8, 9, 10].map((n, r) => (
        <div key={r} style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: n }).map((_, i) => (
            <span key={i} className="dot" style={{ opacity: 0.2 + r * 0.05 }} />
          ))}
        </div>
      ))}
      <div style={{ width: 40, height: 2, background: 'var(--bronze)', marginTop: 8 }} />
    </div>
  )
}

const configs = [
  ['theatre', 'Theatre', 'Up to 500 guests'],
  ['banquet', 'Banquet', 'Up to 350 guests'],
  ['cocktail', 'Cocktail', 'Up to 450 guests'],
  ['classroom', 'Classroom', 'Up to 200 guests'],
]

export default function EventHall() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    event_type: '',
    preferred_date: '',
    expected_guests: '',
    message: '',
  })
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setStatus(null)
    const res = await insertInto(
      'event_enquiries',
      {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone || null,
        event_type: form.event_type || null,
        preferred_date: form.preferred_date || null,
        expected_guests: form.expected_guests ? Number(form.expected_guests) : null,
        message: form.message || null,
      },
      `New event enquiry${form.event_type ? ` — ${form.event_type}` : ''}`
    )
    setBusy(false)
    if (res.ok) {
      setStatus({ ok: true, message: 'Enquiry sent — our events team will be in touch within 24 hours.' })
      setForm({ full_name: '', email: '', phone: '', event_type: '', preferred_date: '', expected_guests: '', message: '' })
    } else {
      setStatus({ ok: false, message: res.error })
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bleed-hero" style={{ height: '85vh' }}>
        <Placeholder src="/eventhall.jpg" alt="Regnum Pavilion event hall" tone="#c9c3b8" caption="event hall — dramatic angle, full setup, atmospheric lighting, event in progress" />
        <div className="overlay">
          <div className="eyebrow mb-16">Event Hall</div>
          <h1 className="hero-title">
            Your event,
            <br />
            our stage.
          </h1>
          <p>800 square metres of flexible, full-service event space in the heart of Ayobo.</p>
        </div>
      </section>

      <AvailabilityBar
        space="events"
        style={{ margin: '60px var(--gutter) 0' }}
        fields={[
          { name: 'event_date', label: 'Event Date', type: 'date' },
          { name: 'event_type', label: 'Event Type', type: 'select', options: eventTypes.map((e) => e[0]), placeholder: 'Select type' },
          { name: 'guests', label: 'Expected Guests', type: 'number', placeholder: 'Number', min: 1 },
        ]}
      />

      {/* Configurations */}
      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow mb-16">Configurations</div>
            <h2 className="h2">The space adapts to you.</h2>
          </div>
        </div>
        <div className="configs">
          {configs.map(([kind, name, cap]) => (
            <div className="config" key={kind}>
              <div className="icon">
                <ConfigGlyph kind={kind} />
              </div>
              <div className="name">{name}</div>
              <div className="cap">{cap}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Event types */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ borderTop: '1px solid var(--divider-soft)', paddingTop: 80 }}>
          <div className="eyebrow mb-16">We Host</div>
          <h2 className="h2 mb-48">Every kind of occasion.</h2>
          <div className="type-list">
            {eventTypes.map(([name, desc]) => (
              <div className="type-row" key={name}>
                <div>
                  <div className="name">{name}</div>
                  <p>{desc}</p>
                </div>
                <span className="arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          Gallery
        </div>
        <div className="gallery-masonry">
          <Placeholder className="tall" src="/weddingreceptionwideshot.jpg" alt="Wedding reception" tone="#d5cfc5" caption="wedding reception — wide shot" />
          <Placeholder src="/corporateeventstage.jpg" alt="Corporate event stage" tone="#ddd8ce" caption="corporate event — stage" />
          <Placeholder src="/tablesettingdetail.jpg" alt="Table setting detail" tone="#e0dbd3" caption="table setting detail" />
          <Placeholder src="/cocktailsetup.jpg" alt="Cocktail setup" tone="#d8d3c9" caption="cocktail setup — evening" />
          <Placeholder src="/emptyeventhall.jpg" alt="Empty event hall" tone="#ccc7bc" caption="empty hall — scale shot" />
        </div>
      </section>

      {/* Venue specs (dark) */}
      <section className="section dark-section">
        <div className="eyebrow mb-48">Venue Specifications</div>
        <div className="specs-dark">
          {venueSpecs.map(([lbl, val, isText]) => (
            <div className="item" key={lbl}>
              <div className="lbl">{lbl}</div>
              {isText ? <div className="txt">{val}</div> : <div className="big">{val}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Past events */}
      <section className="section">
        <div className="eyebrow mb-16">Past Events</div>
        <h2 className="h2 mb-48">Moments we’ve made possible.</h2>
        <div className="past-events">
          {pastEvents.map(([title, meta, tone, cap, img]) => (
            <div key={title}>
              <Placeholder src={img} alt={title} tone={tone} caption={cap} />
              <div className="title">{title}</div>
              <div className="meta">{meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Inquiry form */}
      <section className="section" style={{ borderTop: '1px solid var(--divider-soft)' }}>
        <div className="form-split">
          <div>
            <div className="eyebrow mb-16">Inquire</div>
            <h2 className="h2" style={{ marginBottom: 16 }}>
              Let’s plan
              <br />
              your event.
            </h2>
            <p className="lead">
              Events need a conversation. Tell us what you’re imagining and our team will be in touch
              within 24 hours.
            </p>
          </div>

          <form className="form-grid" onSubmit={onSubmit}>
            <div className="form-row">
              <Field label="Full Name" name="full_name" value={form.full_name} onChange={set('full_name')} placeholder="Your name" required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
            </div>
            <div className="form-row">
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+234" />
              <Select label="Event Type" name="event_type" value={form.event_type} onChange={set('event_type')} placeholder="Select type" options={eventTypes.map((e) => e[0])} />
            </div>
            <div className="form-row">
              <Field label="Preferred Date" name="preferred_date" type="date" value={form.preferred_date} onChange={set('preferred_date')} />
              <Field label="Expected Guests" name="expected_guests" type="number" min="1" value={form.expected_guests} onChange={set('expected_guests')} placeholder="Estimated number" />
            </div>
            <Textarea label="Message" name="message" value={form.message} onChange={set('message')} placeholder="Tell us about your event…" />
            <div>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? 'Sending…' : 'Submit Inquiry'}
              </button>
              <FormStatus status={status} />
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
