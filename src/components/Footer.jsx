import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-brand">
          <div className="mark">
            R E G N U M
            <small>P A V I L I O N</small>
          </div>
          <p>
            13 Olayemi Road, Alaja Extension
            <br />
            Ipaja, Lagos 100278
          </p>
        </div>

        <div className="footer-col">
          <div className="title">Spaces</div>
          <nav>
            <Link to="/rooms">Rooms</Link>
            <Link to="/restaurant">Restaurant</Link>
            <Link to="/boardroom">Boardroom</Link>
            <Link to="/events">Events</Link>
          </nav>
        </div>

        <div className="footer-col">
          <div className="title">Visit</div>
          <nav>
            <Link to="/location">Location</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        <div className="footer-col">
          <div className="title">Connect</div>
          <nav>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://wa.me/2348012345670" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </nav>
        </div>
      </footer>
      <div className="footer-legal">© 2026 Regnum Pavilion. All rights reserved.</div>
    </>
  )
}
