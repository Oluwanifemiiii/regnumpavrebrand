import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Rooms from './pages/Rooms.jsx'
import RoomDetail from './pages/RoomDetail.jsx'
import Restaurant from './pages/Restaurant.jsx'
import Boardroom from './pages/Boardroom.jsx'
import EventHall from './pages/EventHall.jsx'
import Location from './pages/Location.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

// Reset scroll to top on every route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Layout>
        {/* Re-keying on pathname replays the enter animation on every route. */}
        <div className="route-transition" key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:slug" element={<RoomDetail />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/boardroom" element={<Boardroom />} />
            <Route path="/events" element={<EventHall />} />
            <Route path="/location" element={<Location />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Layout>
    </>
  )
}
