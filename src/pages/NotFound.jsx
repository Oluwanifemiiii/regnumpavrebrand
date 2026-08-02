import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', padding: '140px 20px' }}>
      <div className="eyebrow mb-16">404</div>
      <h1 className="h1" style={{ marginBottom: 20 }}>
        This page has checked out.
      </h1>
      <p className="lead" style={{ maxWidth: 400, margin: '0 auto 36px' }}>
        The page you’re looking for isn’t here. Let’s get you back to the pavilion.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </section>
  )
}
