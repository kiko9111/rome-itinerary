import { useState } from 'react'
import { HOTEL, PLACES } from './data.js'
import { DETAILS } from './details.js'
import { computeTimeline, toMin, fmt, dayOptions, chosenOption, dayStats } from './utils.js'
import { sunTimes, typicalWeather } from './sun.js'
import { TripRadar } from './RomeMap.jsx'
import Photo from './Photo.jsx'
import LiveMap from './LiveMap.jsx'

const BOOKINGS = [
  { id: 'colosseum', what: 'Colosseum, Forum & Palatine', when: 'Sat 14 Nov · 08:30', day: 2, price: '~€18', url: 'https://colosseo.it/en/' },
  { id: 'vatican', what: 'Vatican Museums & Sistine Chapel', when: 'Sat 21 Nov · 08:00', day: 9, price: '~€25 incl. fee', url: 'https://www.museivaticani.va/' },
  { id: 'borghese', what: 'Borghese Gallery', when: 'Sun 22 Nov · 09:00', day: 10, price: '~€17 incl. fee', url: 'https://www.galleriaborghese.beniculturali.it/' },
  { id: 'opera', what: 'Teatro dell\'Opera (optional)', when: 'Tue 24 Nov · evening', day: 12, price: 'from ~€25', url: 'https://www.operaroma.it/en/' },
  { id: 'dinners', what: 'Popular dinners: Armando al Pantheon, Roscioli, Da Felice', when: 'A few days ahead', day: null, price: '', url: null },
  { id: 'trains', what: 'Day-trip trains (Florence, Naples) if you choose them', when: 'Book early for cheaper fares', day: null, price: '~€20–50 each way', url: 'https://www.trenitalia.com/en.html' },
]

const ESSENTIALS = [
  { t: 'Getting around', b: 'A single bus/metro ticket costs €1.50 and lasts 100 minutes. You can tap a contactless card at metro gates and on buses. Day passes are also sold at tabacchi.' },
  { t: 'Free water', b: 'The "nasoni" street fountains give free, cold drinking water. Bring a bottle and refill everywhere.' },
  { t: 'Dress code', b: 'Churches, including St Peter\'s and the Vatican, need shoulders and knees covered.' },
  { t: 'Mondays', b: 'Most state museums close on Mondays (Borghese, Castel Sant\'Angelo, Barberini, Ostia). The plan keeps Mondays for open-air walks.' },
  { t: 'Eating', b: 'Lunch 12:30–15:00, dinner from 19:30. A "coperto" cover charge is normal. Tipping is optional: round up for good service.' },
  { t: 'Coffee', b: 'Drink it standing at the bar ("al banco"): it costs about half the price of table service.' },
  { t: 'Safety', b: 'Watch for pickpockets on bus 64, Metro A, at Termini and the Trevi Fountain. Use official white taxis or the FreeNow / itTaxi apps.' },
  { t: 'Emergency', b: 'Dial 112 for any emergency.' },
]

function SunsetChart({ trip }) {
  const [hover, setHover] = useState(null)
  const data = trip.map((d) => ({ d, sun: sunTimes(d.iso), wx: typicalWeather(d.iso) }))
  const W = 640, H = 170, L = 44, R = 12, T = 16, B = 28
  const x = (i) => L + (i * (W - L - R)) / (data.length - 1)
  const minY = 16 * 60 + 30, maxY = 17 * 60
  const y = (m) => T + ((maxY - m) * (H - T - B)) / (maxY - minY)
  const line = data.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.sun.sunset).toFixed(1)}`).join(' ')
  const h = hover != null ? data[hover] : null
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Sunset time for each day of the trip" onMouseLeave={() => setHover(null)}>
        {[16 * 60 + 30, 16 * 60 + 40, 16 * 60 + 50, 17 * 60].map((m) => (
          <g key={m}>
            <line x1={L} x2={W - R} y1={y(m)} y2={y(m)} className="c-grid" />
            <text x={L - 6} y={y(m) + 4} className="c-axis" textAnchor="end">{fmt(m)}</text>
          </g>
        ))}
        {data.map((p, i) => (i % 3 === 0 || i === data.length - 1) && (
          <text key={i} x={x(i)} y={H - 8} className="c-axis" textAnchor="middle">{p.d.dayNum} Nov</text>
        ))}
        <path d={`${line} L${x(data.length - 1)},${H - B} L${x(0)},${H - B} Z`} className="c-area" />
        <path d={line} className="c-line" />
        {hover != null && <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} className="c-cross" />}
        {data.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.sun.sunset)} r={hover === i || i === data.length - 1 ? 5 : 3} className="c-dot" />
            <rect x={x(i) - 14} y={T} width="28" height={H - T - B} fill="transparent" onMouseEnter={() => setHover(i)} onFocus={() => setHover(i)} tabIndex={-1} />
          </g>
        ))}
        <text x={x(data.length - 1) - 6} y={y(data[data.length - 1].sun.sunset) + 18} className="c-label" textAnchor="end">{fmt(data[data.length - 1].sun.sunset)}</text>
        <text x={x(0) + 6} y={y(data[0].sun.sunset) - 8} className="c-label">{fmt(data[0].sun.sunset)}</text>
      </svg>
      <p className="chart-tip">{h ? `${h.d.label}: sunset ${fmt(h.sun.sunset)}, sunrise ${fmt(h.sun.sunrise)}` : 'Hover a day for sunrise and sunset.'}</p>
    </div>
  )
}

function TempChart({ trip }) {
  const data = trip.map((d) => ({ d, wx: typicalWeather(d.iso) }))
  const W = 640, H = 150, L = 44, R = 12, T = 12, B = 28
  const bw = (W - L - R) / data.length
  const y = (t) => T + ((20 - t) * (H - T - B)) / 16
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Typical daily low and high temperature">
        {[4, 8, 12, 16, 20].map((t) => (
          <g key={t}><line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="c-grid" /><text x={L - 6} y={y(t) + 4} className="c-axis" textAnchor="end">{t}°</text></g>
        ))}
        {data.map((p, i) => (
          <g key={i}>
            <title>{`${p.d.label}: typically ${p.wx.low}° to ${p.wx.high}°C`}</title>
            <rect x={L + i * bw + bw * 0.28} y={y(p.wx.high)} width={bw * 0.44} height={y(p.wx.low) - y(p.wx.high)} rx="4" className="c-bar" />
            {(i % 3 === 0 || i === data.length - 1) && <text x={L + i * bw + bw / 2} y={H - 8} className="c-axis" textAnchor="middle">{p.d.dayNum}</text>}
          </g>
        ))}
        <text x={L + bw / 2} y={y(data[0].wx.high) - 6} className="c-label" textAnchor="middle">{data[0].wx.high}°</text>
        <text x={L + (data.length - 0.5) * bw} y={y(data[data.length - 1].wx.low) + 16} className="c-label" textAnchor="middle">{data[data.length - 1].wx.low}°</text>
      </svg>
      <p className="chart-tip">Typical November range in Rome: mild days, cool evenings, rain on about one day in three. Pack a light jacket and an umbrella.</p>
    </div>
  )
}

export default function Overview({ trip, today, todayIndex, settings, choices, done, booked, setBooked, go }) {
  const plans = trip.map((d) => {
    const opt = chosenOption(d, choices)
    const start = toMin(d.isWeekend ? settings.weekendStart : settings.weekdayStart)
    const tl = computeTimeline(opt.stops, d.dow, start)
    return { d, opt, tl, stats: dayStats(tl.rows) }
  })
  const totalStops = plans.reduce((s, p) => s + p.tl.rows.filter((r) => r.place.kind !== 'transport').length, 0)
  const uniquePlaces = new Set(plans.flatMap((p) => p.opt.stops.map((s) => s.p).filter((id) => PLACES[id].kind !== 'transport'))).size
  const walkKm = plans.reduce((s, p) => s + p.stats.walkKm, 0)
  const tickets = plans.reduce((s, p) => s + p.stats.tickets, 0)
  const doneTotal = plans.reduce((s, p) => s + p.tl.rows.filter((r) => done[`${p.d.iso}:${p.opt.id}:${r.index}`]).length, 0)
  const totalRows = plans.reduce((s, p) => s + p.tl.rows.length, 0)
  const tripsAvail = trip.reduce((s, d) => s + (d.plan.alts?.length || 0), 0)
  const todayPlan = todayIndex >= 0 ? plans[todayIndex] : null
  const firstMon = (trip[0].dow + 6) % 7 // blank cells before Thu
  const placeDays = {}
  plans.forEach(({ d, opt }) => opt.stops.forEach((st) => {
    if (PLACES[st.p].kind === 'transport' || Math.abs(PLACES[st.p].lat - 41.9) > 0.1) return
    ;(placeDays[st.p] ||= []).push(`Day ${d.index + 1}`)
  }))
  const mapPlaces = Object.entries(placeDays).map(([id, days]) => ({ id, p: PLACES[id], days: days.join(', ') }))
  const hl = [
    ['colosseum', 'Colosseum'], ['pantheon', 'Pantheon', 'end'], ['trevi', 'Trevi'], ['stPeters', "St Peter's", 'end', 2],
    ['borghese', 'Borghese Gallery'], ['spanishSteps', 'Spanish Steps'], ['castel', "Castel Sant'Angelo", 'end', -1.5],
    ['smTrastevere', 'Trastevere', 'end'], ['capitoline', 'Capitoline', 'end'], ['appia', 'Appian Way'], ['testaccio', 'Testaccio', 'end'],
  ].map(([id, label, anchor, dy]) => ({ p: PLACES[id], label, anchor, dy }))

  return (
    <div className="overview">
      <section className="ov-hero">
        <Photo id="colosseum" kind="colosseum" mode="dusk" className="skyline" alt="The Colosseum" />
        <div className="hero-shade" />
        <div className="ov-hero-text">
          <p className="eyebrow">12 → 30 November 2026 · 19 days</p>
          <h1>Rome, after work and every weekend</h1>
          <p className="ov-lede">Evening walks on weekdays, full days on weekends, and day trips by train when you want a change. Everything starts from {HOTEL.name} on Via Po.</p>
        </div>
      </section>

      {todayPlan && (
        <button className="today-card" onClick={() => go(todayIndex)}>
          <Photo id={todayPlan.tl.rows.find((r) => r.place.kind !== 'transport')?.stop.p} kind={DETAILS[todayPlan.tl.rows.find((r) => r.place.kind !== 'transport')?.stop.p]?.art} mode="night" className="today-art" credit={false} />
          <span className="today-body">
            <span className="eyebrow">Today · Day {todayIndex + 1}</span>
            <span className="today-title">{todayPlan.opt.title}</span>
            <span className="today-meta">Leave at {fmt(todayPlan.tl.departHotel)} · {todayPlan.tl.rows.length} stops · {todayPlan.tl.rows.map((r) => r.place.name.split(/[(&]/)[0].trim()).join(' → ')}</span>
            <span className="today-go">Open today's plan →</span>
          </span>
        </button>
      )}

      <section className="tiles">
        <div className="tile"><span className="tile-v">19</span><span className="tile-k">days · 13 evenings, 6 full days</span></div>
        <div className="tile"><span className="tile-v">{uniquePlaces}</span><span className="tile-k">places in your plan ({totalStops} visits)</span></div>
        <div className="tile"><span className="tile-v">~{Math.round(walkKm)} km</span><span className="tile-k">of walking between stops</span></div>
        <div className="tile"><span className="tile-v">~€{tickets}</span><span className="tile-k">in entry tickets for this plan</span></div>
        <div className="tile"><span className="tile-v">{tripsAvail}</span><span className="tile-k">day-trip options on weekends</span></div>
        <div className="tile"><span className="tile-v">{doneTotal}/{totalRows}</span><span className="tile-k">stops ticked off</span>
          <span className="meter"><span style={{ width: `${(doneTotal / Math.max(1, totalRows)) * 100}%` }} /></span></div>
      </section>

      <section className="ov-sec">
        <h2 className="sec-title">Your 19 days</h2>
        <div className="cal-head" aria-hidden="true">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}</div>
        <div className="cal">
          {Array.from({ length: firstMon }, (_, i) => <span key={`b${i}`} className="cal-blank" />)}
          {plans.map(({ d, opt, tl }) => {
            const lead = tl.rows.find((r) => r.place.kind !== 'transport')
            const mode = d.isWeekend ? 'day' : 'night'
            const nDone = tl.rows.filter((r) => done[`${d.iso}:${opt.id}:${r.index}`]).length
            return (
              <button key={d.iso} className={`cal-day ${d.isWeekend ? 'we' : 'wd'} ${d.iso === today ? 'today' : ''}`} onClick={() => go(d.index)}>
                <Photo id={lead?.stop.p} kind={DETAILS[lead?.stop.p]?.art} mode={mode} className="cal-art" credit={false} />
                <span className="cal-body">
                  <span className="cal-date"><b>{d.dayNum}</b> {d.short}{d.iso === today ? ' · Today' : ''}</span>
                  <span className="cal-title">{opt.id === 'rome' ? d.plan.title : opt.title}</span>
                  <span className="cal-meta">{d.isWeekend ? 'Full day' : `From ${settings.weekdayStart}`} · {tl.rows.length} {tl.rows.length === 1 ? 'stop' : 'stops'}{nDone ? ` · ${nDone} done` : ''}</span>
                  {d.plan.alts && <span className="cal-alt">+ {d.plan.alts.map((a) => a.title.replace(/^(Half-day|Day) trip: /, '').split(/[(]/)[0].trim()).join(', ')}</span>}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="ov-grid">
        <div className="panel">
          <h2 className="sec-title">Book before you go</h2>
          <ul className="book">
            {BOOKINGS.map((b) => (
              <li key={b.id} className={booked[b.id] ? 'is-booked' : ''}>
                <label htmlFor={`book-${b.id}`}>
                  <input id={`book-${b.id}`} type="checkbox" checked={!!booked[b.id]} onChange={() => setBooked((x) => ({ ...x, [b.id]: !x[b.id] }))} />
                  <span>
                    <span className="book-what">{b.what}</span>
                    <span className="book-when">{b.when}{b.price ? ` · ${b.price}` : ''}</span>
                  </span>
                </label>
                <span className="book-links">
                  {b.day != null && <button className="link-btn" onClick={() => go(b.day)}>See day</button>}
                  {b.url && <a href={b.url} target="_blank" rel="noreferrer">Book ↗</a>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2 className="sec-title">Daylight: sunset each day</h2>
          <SunsetChart trip={trip} />
          <p className="panel-note">It gets dark before your weekday plans start, so evening stops are chosen to look their best floodlit.</p>
        </div>
      </section>

      <section className="ov-grid">
        <div className="panel">
          <h2 className="sec-title">Typical weather</h2>
          <TempChart trip={trip} />
        </div>
        <div className="panel">
          <h2 className="sec-title">Day trips by train</h2>
          <TripRadar />
        </div>
      </section>

      <section className="ov-sec">
        <h2 className="sec-title">Everything on your list</h2>
        <LiveMap places={mapPlaces} className="big" fallbackProps={{ allPlaces: true, highlight: hl, className: 'big', aspect: 1.5, showAreas: false }} />
        <p className="legend"><span><i className="lg lg-h" />{HOTEL.name}</span><span><i className="lg lg-dot" />A stop in your plan</span><span><i className="lg lg-wall" />Aurelian Walls (the old city)</span><span><i className="lg lg-river" />Tiber</span></p>
      </section>

      <section className="ov-sec">
        <h2 className="sec-title">Rome essentials</h2>
        <div className="ess">
          {ESSENTIALS.map((e) => <div key={e.t} className="ess-item"><h3>{e.t}</h3><p>{e.b}</p></div>)}
        </div>
      </section>
      <p className="fine">Prices and hours are approximate November figures and change often. Check the official sites linked on each stop.</p>
    </div>
  )
}
