import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'

const primary = [
  { to: '/rooms', label: 'Rooms' },
  { to: '/restaurant', label: 'Restaurant' },
  { to: '/boardroom', label: 'Boardroom' },
  { to: '/events', label: 'Events' },
]

function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="Regnum Pavilion — home">
      R E G N U M
      <small>P A V I L I O N</small>
    </Link>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu on navigation and lock body scroll while open.
  useEffect(() => setMenuOpen(false), [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        {/* left links (desktop) */}
        <div className="nav-group nav-desktop">
          {primary.slice(0, 2).map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.label}
            </NavLink>
          ))}
        </div>

        <Logo />

        {/* right links (desktop) */}
        <div className="nav-group nav-desktop">
          {primary.slice(2).map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn btn-pill">
            Book
          </Link>
        </div>

        {/* mobile controls */}
        <div className="nav-mobile-only">
          <Link to="/contact" className="btn btn-pill">
            Book
          </Link>
          <button
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true">
          <div className="mobile-menu-top">
            <span className="logo">R E G N U M</span>
            <button className="mobile-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <span />
              <span />
            </button>
          </div>
          <div className="mobile-links">
            {primary.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mobile-sublinks">
            <Link to="/location">Location</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="mobile-menu-foot">
            <Link to="/contact" className="btn btn-bronze btn-block">
              Book Now
            </Link>
            <p>13 Olayemi Road, Ipaja, Lagos</p>
          </div>
        </div>
      )}
    </>
  )
}
