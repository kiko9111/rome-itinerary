// A hand-built vector map of central Rome: the Tiber, the Aurelian Walls, parks and the Vatican,
// with the day's route on top. Works offline and inside the shared page (no map tiles needed).
import { HOTEL, PLACES } from './data.js'

const COS = Math.cos((41.9 * Math.PI) / 180)
export const px = (lng) => (lng - 12.4) * 1000 * COS
export const py = (lat) => (42.0 - lat) * 1000
const pt = ([lat, lng]) => `${px(lng).toFixed(2)},${py(lat).toFixed(2)}`
const path = (pts, close) => 'M' + pts.map(pt).join(' L') + (close ? ' Z' : '')

const TIBER = [[41.9450, 12.4690], [41.9356, 12.4673], [41.9300, 12.4660], [41.9230, 12.4672], [41.9180, 12.4690], [41.9140, 12.4705],
  [41.9105, 12.4718], [41.9062, 12.4737], [41.9030, 12.4725], [41.9022, 12.4690], [41.9017, 12.4664], [41.9000, 12.4650],
  [41.8960, 12.4660], [41.8925, 12.4705], [41.8915, 12.4735], [41.8906, 12.4775], [41.8880, 12.4795], [41.8840, 12.4775],
  [41.8805, 12.4740], [41.8740, 12.4690], [41.8650, 12.4700], [41.8560, 12.4770], [41.8450, 12.4720]]
const WALLS = [[41.9118, 12.4762], [41.9125, 12.4820], [41.9098, 12.4895], [41.9096, 12.4994], [41.9093, 12.5022], [41.9062, 12.5085],
  [41.8985, 12.5110], [41.8915, 12.5155], [41.8840, 12.5080], [41.8790, 12.4990], [41.8745, 12.5000], [41.8735, 12.5015],
  [41.8745, 12.4905], [41.8762, 12.4812], [41.8775, 12.4722], [41.8810, 12.4740], [41.8860, 12.4600], [41.8920, 12.4675],
  [41.8960, 12.4660], [41.9000, 12.4650], [41.9030, 12.4725], [41.9062, 12.4737], [41.9105, 12.4718]]
const PARKS = [
  [[41.9130, 12.4790], [41.9165, 12.4810], [41.9195, 12.4880], [41.9150, 12.4940], [41.9118, 12.4925], [41.9106, 12.4872], [41.9118, 12.4800]],
  [[41.8940, 12.4595], [41.8975, 12.4620], [41.8930, 12.4640], [41.8875, 12.4620], [41.8880, 12.4580]],
  [[41.8905, 12.4835], [41.8925, 12.4870], [41.8905, 12.4905], [41.8870, 12.4890], [41.8875, 12.4845]],
  [[41.8770, 12.4950], [41.8810, 12.4960], [41.8800, 12.4910], [41.8760, 12.4900]],
  [[41.8770, 12.4980], [41.8700, 12.5030], [41.8500, 12.5150], [41.8450, 12.5250], [41.8560, 12.5240], [41.8690, 12.5100]],
]
const VATICAN = [[41.9070, 12.4505], [41.9075, 12.4560], [41.9040, 12.4575], [41.9028, 12.4585], [41.9012, 12.4570], [41.9000, 12.4500], [41.9022, 12.4470], [41.9050, 12.4465]]
const AREAS = [
  ['Centro Storico', 41.8990, 12.4750], ['Trastevere', 41.8870, 12.4680], ['Monti', 41.8945, 12.4950], ['Testaccio', 41.8775, 12.4745],
  ['Prati', 41.9095, 12.4620], ['Vatican', 41.9040, 12.4510], ['Villa Borghese', 41.9150, 12.4870], ['Esquilino', 41.8960, 12.5050],
  ['Aventine', 41.8830, 12.4810], ['Appia Antica', 41.8580, 12.5130], ['Trieste', 41.9180, 12.5020],
]

export default function RomeMap({ rows = [], allPlaces = false, highlight = [], className = '', showAreas = true, aspect = 1.6, awayLabel = '' }) {
  const routePts = rows.map((r) => [r.place.lat, r.place.lng])
  const firstTrain = rows.findIndex((r) => r.travel?.train)
  const isAway = firstTrain >= 0 && rows.slice(firstTrain).some((r) => Math.abs(r.place.lat - HOTEL.lat) > 0.15 || Math.abs(r.place.lng - HOTEL.lng) > 0.2)
  const shownRows = isAway ? rows.slice(firstTrain) : rows
  const pts = isAway ? shownRows.map((r) => [r.place.lat, r.place.lng]) : [[HOTEL.lat, HOTEL.lng], ...routePts]

  const allRome = Object.values(PLACES).filter((p) => Math.abs(p.lat - 41.89) < 0.06 && Math.abs(p.lng - 12.49) < 0.06)
  const fitPts = allPlaces ? [...allRome.map((p) => [p.lat, p.lng]), [HOTEL.lat, HOTEL.lng]] : pts
  const xs = fitPts.map((p) => px(p[1]))
  const ys = fitPts.map((p) => py(p[0]))
  let x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const minSpan = isAway ? 4 : 12
  let w = Math.max(x1 - x0, minSpan) * 1.3
  let h = Math.max(y1 - y0, minSpan / aspect) * 1.3
  if (w / h > aspect) h = w / aspect
  else w = h * aspect
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
  x0 = cx - w / 2; y0 = cy - h / 2
  const u = w / 100 // 1% of width, for sizing marks and text

  return (
    <svg className={`romemap ${className}`} viewBox={`${x0} ${y0} ${w} ${h}`} role="img" aria-label="Map of the route">
      <rect x={x0} y={y0} width={w} height={h} className="m-land" />
      {!isAway && (
        <g>
          <path d={path(WALLS, true)} className="m-inside" />
          {PARKS.map((pk, i) => <path key={i} d={path(pk, true)} className="m-park" />)}
          <path d={path(VATICAN, true)} className="m-vatican" />
          <path d={path(WALLS, true)} className="m-walls" strokeWidth={u * 0.35} strokeDasharray={`${u} ${u * 0.6}`} />
          <path d={path(TIBER)} className="m-river" strokeWidth={Math.max(0.9, u * 1.1)} />
          {showAreas && AREAS.map(([n, lat, lng]) => (
            <text key={n} x={px(lng)} y={py(lat)} className="m-area" fontSize={u * (allPlaces ? 1.7 : 2.4)} textAnchor="middle">{n.toUpperCase()}</text>
          ))}
          {allRome.map((p, i) => <circle key={i} cx={px(p.lng)} cy={py(p.lat)} r={u * 0.55} className="m-dot" />)}
          <g>
            <circle cx={px(HOTEL.lng)} cy={py(HOTEL.lat)} r={u * 2.2} className="m-hotel" />
            <text x={px(HOTEL.lng)} y={py(HOTEL.lat) + u * 0.85} fontSize={u * 2.4} className="m-hotel-t" textAnchor="middle">H</text>
          </g>
        </g>
      )}
      {isAway && awayLabel && <text x={x0 + u * 3} y={y0 + u * 5} fontSize={u * 3} className="m-area">{awayLabel.toUpperCase()}</text>}
      {!allPlaces && pts.length > 1 && (
        <path d={path(pts)} className="m-route" strokeWidth={u * 0.5} strokeDasharray={`${u * 1.4} ${u * 0.9}`} />
      )}
      {!allPlaces && shownRows.map((r) => (
        <g key={r.index}>
          <circle cx={px(r.place.lng)} cy={py(r.place.lat)} r={u * 2.4} className={`m-pin m-${r.status?.level || 'ok'}`} strokeWidth={u * 0.4} />
          <text x={px(r.place.lng)} y={py(r.place.lat) + u * 0.9} fontSize={u * 2.5} className="m-pin-t" textAnchor="middle">{r.index + 1}</text>
        </g>
      ))}
      {allPlaces && highlight.map(({ p, label, anchor, dy }) => (
        <g key={label}>
          <circle cx={px(p.lng)} cy={py(p.lat)} r={u * 0.8} className="m-hl" />
          <text x={px(p.lng) + (anchor === 'end' ? -u * 1.3 : u * 1.3)} y={py(p.lat) + u * 0.6 + (dy || 0) * u} fontSize={u * 1.75} className="m-label" textAnchor={anchor || 'start'}>{label}</text>
        </g>
      ))}
    </svg>
  )
}

// Central Italy, schematic, with the day-trip destinations and train times from Rome.
const COAST = [[43.55, 10.31], [42.93, 10.5], [42.7, 10.98], [42.44, 11.21], [42.09, 11.79], [41.73, 12.28], [41.45, 12.62],
  [41.28, 13.25], [41.21, 13.57], [41.11, 13.89], [40.84, 14.25], [40.63, 14.37], [40.57, 14.33], [40.68, 14.76], [40.4, 14.95]]
const TRIPS = [
  { name: 'Florence', lat: 43.7696, lng: 11.2558, time: '1h35' },
  { name: 'Assisi', lat: 43.0707, lng: 12.6196, time: '2h10' },
  { name: 'Orvieto', lat: 42.7185, lng: 12.1107, time: '1h15' },
  { name: 'Tivoli', lat: 41.9632, lng: 12.7962, time: '1h', dy: -16 },
  { name: 'Ostia Antica', lat: 41.7558, lng: 12.2918, time: '40 min', anchor: 'end', dy: 10 },
  { name: 'Naples', lat: 40.8518, lng: 14.2681, time: '1h10', anchor: 'end', dy: -10 },
  { name: 'Pompeii', lat: 40.7486, lng: 14.4847, time: '1h50', dy: 6 },
]
export function TripRadar() {
  const k = 100
  const X = (lng) => (lng - 10) * k * Math.cos((42 * Math.PI) / 180)
  const Y = (lat) => (44.2 - lat) * k
  const rome = { lat: 41.9028, lng: 12.4964 }
  const coast = COAST.map(([la, ln]) => `${X(ln).toFixed(1)},${Y(la).toFixed(1)}`).join(' L')
  return (
    <svg className="radar" viewBox={`${X(10)} ${Y(44.2)} ${X(15.9) - X(10)} ${Y(40.3) - Y(44.2)}`} role="img" aria-label="Day trips from Rome with train times">
      <rect x={X(10)} y={Y(44.2)} width={X(15.9) - X(10)} height={Y(40.3) - Y(44.2)} className="m-land" />
      <path d={`M${X(10)},${Y(43.55)} L${coast} L${X(14.95)},${Y(40.3)} L${X(10)},${Y(40.3)} Z`} className="m-sea" />
      {TRIPS.map((t) => (
        <g key={t.name}>
          <line x1={X(rome.lng)} y1={Y(rome.lat)} x2={X(t.lng)} y2={Y(t.lat)} className="m-route" strokeWidth="1.4" strokeDasharray="4 3" />
          <circle cx={X(t.lng)} cy={Y(t.lat)} r="5" className="m-pin m-ok" strokeWidth="1.5" />
          <text x={X(t.lng) + (t.anchor ? -9 : 9)} y={Y(t.lat) + 4 + (t.dy || 0)} className="r-name" textAnchor={t.anchor || 'start'}>{t.name}</text>
          <text x={X(t.lng) + (t.anchor ? -9 : 9)} y={Y(t.lat) + 17 + (t.dy || 0)} className="r-time" textAnchor={t.anchor || 'start'}>{t.time} by train</text>
        </g>
      ))}
      <circle cx={X(rome.lng)} cy={Y(rome.lat)} r="8" className="m-hotel" />
      <text x={X(rome.lng) - 12} y={Y(rome.lat) + 5} className="r-rome" textAnchor="end">Rome</text>
      <text x={X(10.6)} y={Y(41.3)} className="r-sea">Tyrrhenian Sea</text>
    </svg>
  )
}
