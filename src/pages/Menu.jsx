import { Link } from 'react-router-dom'
import FullMenu from '../components/FullMenu.jsx'

// Standalone, mobile-first menu page — the target of the table QR code.
export default function Menu() {
  return (
    <section className="section qr-menu">
      <div className="eyebrow mb-16">Regnum Pavilion Hotel</div>
      <h1 className="h2 mb-48">Our menu.</h1>
      <FullMenu />
      <p className="menu-foot">
        Prices in Naira. To order, please call your server or the front desk.{' '}
        <Link to="/restaurant">Reserve a table</Link>
      </p>
    </section>
  )
}
