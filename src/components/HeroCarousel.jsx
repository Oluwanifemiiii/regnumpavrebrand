import { useState, useEffect, useCallback, useRef } from 'react'

// Cross-fading hero carousel. Auto-advances, pauses on hover, supports swipe,
// dots + (hover) arrows, and honours prefers-reduced-motion (no auto-advance,
// no fade). Sits behind the page's existing scrim + headline overlay.
export default function HeroCarousel({ slides, interval = 5500 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const touchX = useRef(null)

  const go = useCallback((i) => setIndex((i + count) % count), [count])
  const next = useCallback(() => setIndex((p) => (p + 1) % count), [count])
  const prev = useCallback(() => setIndex((p) => (p - 1 + count) % count), [count])

  useEffect(() => {
    if (paused || count <= 1) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(next, interval)
    return () => clearInterval(id)
  }, [paused, count, interval, next, index])

  const onTouchStart = (e) => {
    touchX.current = e.changedTouches[0].clientX
  }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)()
    touchX.current = null
  }

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          className={`hero-slide ${i === index ? 'is-active' : ''}`}
          aria-hidden={i !== index}
        >
          <img src={s.src} alt={s.alt || ''} loading={i === 0 ? 'eager' : 'lazy'} />
        </div>
      ))}

      {count > 1 && (
        <>
          <button className="hero-arrow prev" onClick={prev} aria-label="Previous photo">
            ‹
          </button>
          <button className="hero-arrow next" onClick={next} aria-label="Next photo">
            ›
          </button>
          <div className="hero-dots" role="tablist" aria-label="Hero photos">
            {slides.map((s, i) => (
              <button
                key={s.src}
                className={`hero-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
