import { useEffect, useMemo, useState } from 'react'
import { HOTEL } from './data.js'
import { buildTrip, todayIso } from './utils.js'
import Overview from './Overview.jsx'
import DayView from './DayView.jsx'
import InstallBar from './InstallBar.jsx'

export const DEFAULT_SETTINGS = { weekdayStart: '18:00', weekendStart: '09:00' }

export function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? { ...initial, ...JSON.parse(raw) } : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue]
}

function readHash(n) {
  const m = /^#day-(\d+)$/.exec(window.location.hash)
  if (m) {
    const i = Number(m[1]) - 1
    if (i >= 0 && i < n) return i
  }
  return -1 // overview
}

export default function App() {
  const trip = useMemo(buildTrip, [])
  const today = todayIso()
  const todayIndex = trip.findIndex((d) => d.iso === today)
  const [view, setView] = useState(() => readHash(trip.length))
  const [settings, setSettings] = useStored('rome.settings', DEFAULT_SETTINGS)
  const [choices, setChoices] = useStored('rome.choices', {})
  const [done, setDone] = useStored('rome.done', {})
  const [booked, setBooked] = useStored('rome.booked', {})
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const onHash = () => setView(readHash(trip.length))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [trip.length])

  const go = (i) => {
    const hash = i < 0 ? '#overview' : `#day-${i + 1}`
    try { window.history.replaceState(null, '', hash) } catch { /* sandboxed */ }
    setView(i)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    document.getElementById(view < 0 ? 'chip-overview' : `chip-${view}`)?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [view])

  const shared = { trip, today, todayIndex, settings, choices, setChoices, done, setDone, booked, setBooked, go }

  return (
    <div className="app">
      <header className="top">
        <div className="top-row wrap">
          <button className="brand" onClick={() => go(-1)}>
            <span className="brand-mark" aria-hidden="true">SPQR</span>
            <span>
              <span className="brand-name">Rome in 19 days</span>
              <span className="brand-sub">From {HOTEL.name} · 12–30 Nov 2026</span>
            </span>
          </button>
          <button className="pill-btn" onClick={() => setShowSettings((s) => !s)} aria-expanded={showSettings}>
            {showSettings ? 'Close' : `Start times · ${settings.weekdayStart}`}
          </button>
        </div>
        {showSettings && (
          <div className="settings wrap">
            <label htmlFor="wd-start">
              On weekdays, I can leave the hotel at
              <input id="wd-start" type="time" value={settings.weekdayStart}
                onChange={(e) => e.target.value && setSettings((s) => ({ ...s, weekdayStart: e.target.value }))} />
            </label>
            <label htmlFor="we-start">
              On weekends, start the day at
              <input id="we-start" type="time" value={settings.weekendStart}
                onChange={(e) => e.target.value && setSettings((s) => ({ ...s, weekendStart: e.target.value }))} />
            </label>
            <p className="hint">
              I assumed work ends between 17:00 and 18:00, so weekday plans start at 18:00 from the hotel. Change it here and every
              arrival time and opening-hours warning updates. Weekend days with a booked first slot start at that slot.
            </p>
            <button className="link-btn" onClick={() => setSettings(DEFAULT_SETTINGS)}>Reset to 18:00 / 09:00</button>
          </div>
        )}
        <nav className="strip wrap" aria-label="Trip days">
          <button id="chip-overview" className={`chip chip-ov ${view < 0 ? 'sel' : ''}`} onClick={() => go(-1)}>
            <span className="chip-dow">Trip</span>
            <span className="chip-num">★</span>
            <span className="chip-n">Overview</span>
          </button>
          {trip.map((d) => (
            <button key={d.iso} id={`chip-${d.index}`}
              className={`chip ${d.isWeekend ? 'we' : 'wd'} ${d.index === view ? 'sel' : ''} ${d.iso === today ? 'today' : ''}`}
              onClick={() => go(d.index)} aria-label={`Day ${d.index + 1}, ${d.label}`}>
              <span className="chip-dow">{d.short}</span>
              <span className="chip-num">{d.dayNum}</span>
              <span className="chip-n">{d.iso === today ? 'Today' : `Day ${d.index + 1}`}</span>
            </button>
          ))}
        </nav>
      </header>
      <InstallBar />
      <main className="wrap">
        {view < 0 ? <Overview {...shared} /> : <DayView key={view} day={trip[view]} {...shared} />}
      </main>
    </div>
  )
}
