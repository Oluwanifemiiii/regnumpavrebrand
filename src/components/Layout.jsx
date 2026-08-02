import AnnouncementBar from './AnnouncementBar.jsx'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

export default function Layout({ children }) {
  return (
    <div className="site">
      <AnnouncementBar />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
