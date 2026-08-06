import Placeholder from '../components/Placeholder.jsx'

const directions = [
  {
    title: 'By Car',
    body: 'From Lagos-Abeokuta Expressway, turn onto Command Road heading south. Take the second right onto Olayemi Road — we’re 200m on your left. The journey from Ikeja takes about 25 minutes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="8" width="16" height="7" rx="1.5" stroke="#1A1714" strokeWidth="1.2" />
        <circle cx="6" cy="15" r="1.5" stroke="#1A1714" strokeWidth="1.2" />
        <circle cx="14" cy="15" r="1.5" stroke="#1A1714" strokeWidth="1.2" />
        <path d="M4 8L6 4H14L16 8" stroke="#1A1714" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: 'From the Airport',
    body: 'Murtala Muhammed International Airport is approximately 35 minutes by car via the Lagos-Abeokuta Expressway. Airport pickup can be arranged — contact our front desk.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3L17 10L10 10L13 17L3 10L10 10L7 3L10 3Z" stroke="#1A1714" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: 'By Taxi / Ride-hail',
    body: 'Search "Regnum Pavilion, Olayemi Road, Ayobo" on Bolt or Uber. The pin drops directly at our entrance. Tell your driver to look for the bronze gate.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="6" width="14" height="10" rx="2" stroke="#1A1714" strokeWidth="1.2" />
        <path d="M7 6V4H13V6" stroke="#1A1714" strokeWidth="1.2" />
        <line x1="3" y1="11" x2="17" y2="11" stroke="#1A1714" strokeWidth="1.2" />
      </svg>
    ),
  },
]

const nearby = [
  ['Ayobo Market', '5 min drive'],
  ['Command Secondary School', '8 min drive'],
  ['Ikeja City Mall', '25 min drive'],
  ['MMA Airport', '35 min drive'],
]

// Google Maps embed pointed at Ayobo, Lagos (no API key required for the
// public embed iframe). Swap the query for the exact street address or
// coordinates when available.
const MAP_SRC =
  'https://www.google.com/maps?q=Ayobo,+Lagos,+Nigeria&output=embed'

export default function Location() {
  return (
    <>
      <header className="page-header">
        <div className="eyebrow" style={{ marginBottom: 32 }}>
          Find Us
        </div>
        <h1 className="h1">
          13 Olayemi Road,
          <br />
          Alaja Extension.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-40)', marginTop: 16 }}>
          Ayobo, Lagos, Nigeria
        </p>
      </header>

      {/* Map */}
      <div className="map-box">
        <iframe
          title="Map — Regnum Pavilion, Ayobo, Lagos"
          src={MAP_SRC}
          style={{ border: 0, width: '100%', height: '100%' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* How to find us */}
      <section className="section">
        <div className="eyebrow mb-16">Getting Here</div>
        <h2 className="h2 mb-48">How to find us.</h2>
        <div className="directions">
          {directions.map((d) => (
            <div className="direction" key={d.title}>
              <div className="head">
                {d.icon}
                <span>{d.title}</span>
              </div>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div style={{ borderTop: '1px solid var(--divider-soft)', paddingTop: 80 }}>
          <div className="eyebrow mb-16">Nearby</div>
          <h2 className="serif" style={{ fontSize: 36, marginBottom: 40 }}>
            In the neighbourhood.
          </h2>
          <div className="nearby">
            {nearby.map(([name, meta]) => (
              <div className="item" key={name}>
                <div className="name">{name}</div>
                <div className="meta">{meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parking (dark) */}
      <div className="parking">
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>
            Parking
          </div>
          <div className="serif">Complimentary on-site parking for 80+ vehicles.</div>
        </div>
        <div className="note">
          Secured lot with 24-hour attendant. Valet available for events. Overflow parking on Olayemi
          Road.
        </div>
      </div>
    </>
  )
}
