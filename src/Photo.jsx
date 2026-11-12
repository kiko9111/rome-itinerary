import { useState } from 'react'
import { PHOTOS } from './photos.js'
import Art from './Art.jsx'

// A real photo of the place (Wikimedia Commons). If the photo can't load
// (offline, or a page that blocks outside images), the drawn illustration shows instead.
export default function Photo({ id, kind, mode = 'day', alt, className = '', credit = true }) {
  const ph = PHOTOS[id]
  const [failed, setFailed] = useState(false)
  if (!ph || failed) return <Art kind={kind} mode={mode} className={className} label={alt} />
  return (
    <span className={`photo ${className}`}>
      <img src={ph.src} alt={alt || ''} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      {credit && <a className="credit" href={ph.page} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Photo: Wikimedia Commons</a>}
    </span>
  )
}
