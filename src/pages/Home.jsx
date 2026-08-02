import { Link } from 'react-router-dom'
import Placeholder from '../components/Placeholder.jsx'

const experiences = [
  {
    to: '/rooms',
    name: 'Rooms',
    blurb: 'Rest, refined. From ₦80,000 per night.',
    img: '/roompic.jpg',
    caption: 'hotel room — crisp linens',
    tone: '#ddd8ce',
  },
  {
    to: '/restaurant',
    name: 'Restaurant',
    blurb: 'Nigerian meets continental, daily.',
    img: '/restaurant.jpg',
    caption: 'plated dish — close up',
    tone: '#d5cfc5',
  },
  {
    to: '/boardroom',
    name: 'Boardroom',
    blurb: 'Focus without distraction.',
    img: '/boardroom.jpg',
    caption: 'boardroom — clean, minimal',
    tone: '#e0dbd3',
  },
  {
    to: '/events',
    name: 'Events',
    blurb: '500 guests. 800 sqm. Your vision.',
    img: '/eventhall.jpg',
    caption: 'event hall — grand setup',
    tone: '#d8d3c9',
  },
]

const testimonials = [
  {
    quote: 'The event hall exceeded every expectation. Our guests are still talking about it.',
    who: 'Adaeze O. — Wedding Reception',
  },
  {
    quote: 'Private, well-equipped, and the catering is consistently excellent.',
    who: 'Chukwuemeka A. — Corporate Client',
  },
  {
    quote: 'We came for the jollof. We returned for the ambiance.',
    who: 'Funke T. — Restaurant Guest',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero — full-bleed cinematic */}
      <section className="hero-cine">
        <Placeholder
          src="/landingpage.jpg"
          alt="Regnum Pavilion"
          tone="#d5cfc5"
          caption="full-bleed hero — restaurant at golden hour or lobby with dramatic shadow play"
        />
        <div className="hero-cine-overlay">
          <h1 className="hero-title">
            Where every
            <br />
            gathering finds
            <br />
            its place.
          </h1>
          <div className="hero-actions">
            <Link to="/rooms" className="btn btn-light">
              Book a Room
            </Link>
            <Link to="/events" className="btn btn-light-outline">
              Explore the Venue
            </Link>
          </div>
        </div>
      </section>

      {/* Four experiences */}
      <section className="section">
        <div className="eyebrow mb-48">Four Experiences</div>
        <div className="experiences">
          {experiences.map((e) => (
            <Link to={e.to} className="exp-card" key={e.to}>
              <Placeholder src={e.img} alt={e.name} tone={e.tone} caption={e.caption} />
              <div className="name">{e.name}</div>
              <p>{e.blurb}</p>
              <span className="link-arrow">Discover →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Venue at a glance */}
      <div className="stats">
        <div className="stat">
          <div className="num">500</div>
          <div className="cap">Guest Capacity</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="num">
            800<small>sqm</small>
          </div>
          <div className="cap">Event Hall</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="num">4</div>
          <div className="cap">Distinct Spaces</div>
        </div>
        <div className="stat-divider" />
        <div className="stat">
          <div className="num">1</div>
          <div className="cap">Address</div>
        </div>
      </div>

      {/* Featured space — full-bleed with overlay */}
      <section className="featured">
        <Placeholder
          src="/eventhall.jpg"
          alt="Regnum Pavilion event hall"
          tone="#d5cfc5"
          caption="event hall — dramatic angle, tables set, atmospheric lighting"
        />
        <div className="featured-overlay">
          <div className="eyebrow mb-16">Featured Space</div>
          <h2 className="h2">Your event, our stage.</h2>
          <p>
            From intimate dinners to grand celebrations — 800 sqm of flexible space, full AV, and a
            dedicated events team.
          </p>
          <Link to="/events" className="btn btn-light">
            Plan Your Event
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="eyebrow mb-48">Guest Voices</div>
        <div className="testimonials-stack">
          {testimonials.map((t) => (
            <blockquote className="testimonial" key={t.who}>
              <q>{t.quote}</q>
              <cite>{t.who}</cite>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Final CTA — dark strip */}
      <section className="cta-strip">
        <h2 className="h2">Ready to book your stay?</h2>
        <div className="actions">
          <Link to="/rooms" className="btn btn-light">
            Book Rooms
          </Link>
          <Link to="/restaurant" className="btn btn-light-outline">
            Reserve a Table
          </Link>
          <Link to="/events" className="btn btn-light-outline">
            Enquire for Events
          </Link>
        </div>
      </section>
    </>
  )
}
