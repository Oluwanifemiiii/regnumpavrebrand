// Image slot. The design used diagonal-hatch placeholders where real
// photography will go. Drop in an <img> here once assets are available —
// pass `src` and it renders the photo instead of the hatch.
export default function Placeholder({ caption, tone, dark, className = '', style, src, alt }) {
  const bg = tone ? { backgroundColor: tone } : undefined
  if (src) {
    return (
      <div className={`ph ${className}`} style={style}>
        <img src={src} alt={alt || caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    )
  }
  return (
    <div className={`ph ${dark ? 'ph-dark' : ''} ${className}`} style={{ ...bg, ...style }}>
      {caption && <span className="ph-caption">{caption}</span>}
    </div>
  )
}
