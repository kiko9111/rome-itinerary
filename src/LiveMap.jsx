import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { HOTEL } from './data.js'
import { PHOTOS } from './photos.js'
import { directionsUrl } from './utils.js'
import RomeMap from './RomeMap.jsx'

const COLORS = { ok: '#2c7443', always: '#4f6576', tight: '#9a620c', late: '#b0352a', closed: '#b0352a', plan: '#2f5d4a' }

// Real street map (OpenStreetMap). Falls back to the drawn map if map tiles can't load.
export default function LiveMap({ rows = [], places = null, className = '', fallbackProps = {} }) {
  const el = useRef(null)
  const [failed, setFailed] = useState(false)
  const sig = places ? `all:${places.length}` : rows.map((r) => `${r.stop.p}:${r.status?.level}`).join('|')

  useEffect(() => {
    if (failed) return
    const map = L.map(el.current, { scrollWheelZoom: false, zoomControl: true })
    let loaded = 0
    let errors = 0
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, subdomains: 'abc', attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    tiles.on('tileload', () => { loaded++ })
    tiles.on('tileerror', () => { errors++; if (!loaded && errors >= 3) setFailed(true) })
    const timer = setTimeout(() => { if (!loaded) setFailed(true) }, 6000)

    const pin = (html, color, size = 28) => L.divIcon({
      html: `<span style="background:${color};width:${size}px;height:${size}px">${html}</span>`,
      className: 'lpin', iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    })
    const popup = (id, name, extra = '') => {
      const ph = PHOTOS[id]
      return `<div class="lpop">${ph ? `<img src="${ph.src}" alt="">` : ''}<b>${name}</b>${extra}</div>`
    }
    const pts = []
    const hotel = [HOTEL.lat, HOTEL.lng]
    L.marker(hotel, { icon: pin('H', '#1d2421', 30), zIndexOffset: 1000 }).bindPopup(`<b>${HOTEL.name}</b><br>${HOTEL.address}`).addTo(map)

    if (places) {
      places.forEach(({ id, p, days }) => {
        L.marker([p.lat, p.lng], { icon: pin('', COLORS.plan, 14) })
          .bindPopup(popup(id, p.name, `<br><small>${days}</small><br><a href="${directionsUrl(HOTEL, p, 'transit')}" target="_blank" rel="noreferrer">Directions from hotel ↗</a>`))
          .addTo(map)
        pts.push([p.lat, p.lng])
      })
      pts.push(hotel)
    } else {
      const firstTrain = rows.findIndex((r) => r.travel?.train)
      const away = firstTrain >= 0
      const shown = away ? rows.slice(firstTrain) : rows
      const line = away ? [] : [hotel]
      shown.forEach((r) => {
        const ll = [r.place.lat, r.place.lng]
        line.push(ll)
        L.marker(ll, { icon: pin(String(r.index + 1), COLORS[r.status?.level] || COLORS.ok) })
          .bindPopup(popup(r.stop.p, r.place.name, `<br><a href="${directionsUrl(r.from, r.place, r.travel.mode)}" target="_blank" rel="noreferrer">Directions ↗</a>`))
          .addTo(map)
      })
      if (line.length > 1) L.polyline(line, { color: '#2f5d4a', weight: 4, opacity: 0.75, dashArray: '8 8' }).addTo(map)
      pts.push(...line)
    }
    map.fitBounds(L.latLngBounds(pts).pad(0.12), { maxZoom: 16 })
    return () => { clearTimeout(timer); map.remove() }
  }, [sig, failed]) // eslint-disable-line react-hooks/exhaustive-deps

  if (failed) return <RomeMap rows={rows} {...fallbackProps} />
  return <div ref={el} className={`livemap ${className}`} role="region" aria-label="Street map" />
}
