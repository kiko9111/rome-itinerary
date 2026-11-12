import { HOTEL, PLACES } from './data.js'
import { DETAILS } from './details.js'
import {
  computeTimeline, directionsUrl, placeUrl, dayRouteUrl, fmt, fmtDur, toMin, estimateTravel,
  dayOptions, dayStats,
} from './utils.js'
import { sunTimes, typicalWeather, skyMode } from './sun.js'
import Photo from './Photo.jsx'
import LiveMap from './LiveMap.jsx'

const STATUS = {
  ok: { label: 'Open', icon: '✓' },
  always: { label: 'Open any time', icon: '∞' },
  tight: { label: 'Tight', icon: '!' },
  late: { label: 'Too late', icon: '✕' },
  closed: { label: 'Closed today', icon: '✕' },
}

function leadStop(rows) {
  return rows.find((r) => r.place.kind !== 'transport') || rows[0]
}

export default function DayView({ day, trip, today, todayIndex, settings, choices, setChoices, done, setDone, go }) {
  const options = dayOptions(day)
  const option = options.find((o) => o.id === choices[day.iso]) || options[0]
  const startMin = toMin(day.isWeekend ? settings.weekendStart : settings.weekdayStart)
  const tl = computeTimeline(option.stops, day.dow, startMin)
  const hasTrain = option.stops.some((s) => s.train)
  const firstTrain = option.stops.find((s) => s.train)?.train.mins || 0
  const backAt = hasTrain ? tl.end + firstTrain + 40 : tl.end + 25
  const stats = dayStats(tl.rows)
  const sun = sunTimes(day.iso)
  const wx = typicalWeather(day.iso)
  const lead = leadStop(tl.rows)
  const leadArt = lead ? DETAILS[lead.stop.p]?.art : 'street'
  const heroMode = lead ? skyMode(lead.arrive, day.iso) : 'day'
  const doneCount = tl.rows.filter((r) => done[`${day.iso}:${option.id}:${r.index}`]).length
  const warnings = tl.rows.filter((r) => ['tight', 'late', 'closed'].includes(r.status.level))

  return (
    <article className="day">
      <section className="hero">
        <Photo id={lead?.stop.p} kind={leadArt} mode={heroMode} className="hero-art" alt={lead?.place.name} />
        <div className="hero-shade" />
        <div className="hero-text">
          <div className="hero-badges">
            <span className={`badge ${day.isWeekend ? 'we' : 'wd'}`}>{day.isWeekend ? 'Weekend · full day' : 'Weekday · after work'}</span>
            {day.iso === today && <span className="badge today">Today</span>}
          </div>
          <p className="eyebrow">Day {day.index + 1} of {trip.length} · {day.label}</p>
          <h1>{option.id === 'rome' ? day.plan.title : option.title}</h1>
        </div>
      </section>

      <section className="facts">
        <div className="fact"><span className="fact-k">Leave hotel</span><span className="fact-v">{fmt(tl.departHotel)}</span></div>
        <div className="fact"><span className="fact-k">Back around</span><span className="fact-v">{fmt(backAt)}</span></div>
        <div className="fact"><span className="fact-k">Stops</span><span className="fact-v">{tl.rows.length}</span></div>
        <div className="fact"><span className="fact-k">Walking</span><span className="fact-v">~{stats.walkKm.toFixed(1)} km</span></div>
        <div className="fact"><span className="fact-k">Tickets</span><span className="fact-v">{stats.tickets ? `~€${stats.tickets}` : 'Free'}</span></div>
        <div className="fact"><span className="fact-k">Sunset</span><span className="fact-v">{fmt(sun.sunset)}</span></div>
        <div className="fact"><span className="fact-k">Typical weather</span><span className="fact-v">{wx.high}° / {wx.low}°</span></div>
        <div className="fact"><span className="fact-k">Done</span><span className="fact-v">{doneCount}/{tl.rows.length}</span></div>
      </section>

      {options.length > 1 && (
        <section className="choose">
          <h2 className="sec-title">Choose today's plan</h2>
          <div className="choice-grid">
            {options.map((o) => {
              const lp = o.stops.find((s) => PLACES[s.p].kind !== 'transport') || o.stops[0]
              const train = o.stops.find((s) => s.train)
              return (
                <button key={o.id} className={`choice ${o.id === option.id ? 'on' : ''}`} aria-pressed={o.id === option.id}
                  onClick={() => setChoices((c) => ({ ...c, [day.iso]: o.id }))}>
                  <Photo id={lp.p} kind={DETAILS[lp.p]?.art} mode="day" className="choice-art" credit={false} />
                  <span className="choice-body">
                    <span className="choice-k">{o.id === 'rome' ? 'Stay in Rome' : o.title.startsWith('Half') ? 'Half-day trip' : 'Day trip'}</span>
                    <span className="choice-t">{o.id === 'rome' ? o.title : o.title.replace(/^(Half-day|Day) trip: /, '')}</span>
                    <span className="choice-m">{train ? `🚆 ~${fmtDur(train.train.mins)} each way` : `${o.stops.length} stops in the city`}</span>
                  </span>
                </button>
              )
            })}
          </div>
          {option.transport && (
            <div className="journey">
              <div className="journey-line">
                <span className="j-dot" />Rome<span className="j-track"><span className="j-train">🚆 ~{fmtDur(firstTrain)}</span></span>
                {option.title.replace(/^(Half-day|Day) trip: /, '').split(/[(&]/)[0].trim()}<span className="j-dot end" />
              </div>
              <p>{option.transport}</p>
            </div>
          )}
        </section>
      )}

      <section className="map-wrap">
        <div className="sec-head">
          <h2 className="sec-title">Route</h2>
          {!hasTrain && option.stops.length > 1 && (
            <a className="btn" href={dayRouteUrl(option.stops)} target="_blank" rel="noreferrer">Open whole route in Google Maps ↗</a>
          )}
        </div>
        <LiveMap rows={tl.rows} fallbackProps={{ awayLabel: hasTrain ? option.title.replace(/^(Half-day|Day) trip: /, '').split(/[(&]/)[0].trim() : '' }} />
        <p className="legend">
          <span><i className="lg lg-h" />Hotel</span><span><i className="lg lg-ok" />Open</span><span><i className="lg lg-always" />Open any time</span>
          <span><i className="lg lg-tight" />Tight</span><span><i className="lg lg-late" />Too late / closed</span>{!hasTrain && <span><i className="lg lg-wall" />Aurelian Walls</span>}
        </p>
      </section>

      {warnings.length > 0 && (
        <section className="alert">
          <strong>Watch the clock today.</strong>{' '}
          {warnings.map((r) => `${r.place.name}: ${r.status.text.toLowerCase()}`).join(' · ')}.
          {!day.isWeekend && ' If you can leave earlier, change your start time at the top.'}
        </section>
      )}

      <section>
        <h2 className="sec-title">Timeline</h2>
        <ol className="timeline">
          <li className="t-row t-start">
            <div className="t-time">{fmt(tl.departHotel)}</div>
            <div className="t-rail"><span className="t-node home">H</span></div>
            <div className="t-body"><p className="t-start-text">Leave <strong>{HOTEL.name}</strong>, {HOTEL.address}</p></div>
          </li>
          {tl.rows.map((r) => {
            const key = `${day.iso}:${option.id}:${r.index}`
            const isDone = !!done[key]
            const d = DETAILS[r.stop.p] || {}
            const mode = skyMode(r.arrive, day.iso)
            const st = STATUS[r.status.level]
            const fromHotelMode = estimateTravel(HOTEL, r.place).mode
            return (
              <li key={key} className={`t-row ${isDone ? 'done' : ''}`}>
                <div className="t-time">{fmt(r.arrive)}<span>{fmt(r.leave)}</span></div>
                <div className="t-rail"><span className={`t-node lv-${r.status.level}`}>{r.index + 1}</span></div>
                <div className="t-body">
                  <div className="leg">
                    <span className="leg-ico" aria-hidden="true">{r.travel.train ? '🚆' : r.travel.mode === 'walking' ? '🚶' : '🚇'}</span>
                    <span>{r.index === 0 ? 'From the hotel: ' : ''}{r.travel.label}{r.waited > 5 ? ` · then wait ~${fmtDur(Math.round(r.waited))}` : ''}</span>
                    <a href={directionsUrl(r.from, r.place, r.travel.mode)} target="_blank" rel="noreferrer">Directions ↗</a>
                  </div>
                  <div className={`card st-${r.status.level}`}>
                    <div className="card-art">
                      <Photo id={r.stop.p} kind={d.art} mode={mode} alt={r.place.name} />
                      <span className="mode-tag">{mode === 'night' ? '☾ You arrive after dark' : mode === 'dusk' ? '◐ You arrive at golden hour' : '☀ You arrive in daylight'}</span>
                      {d.area && <span className="area-tag">{d.area}</span>}
                    </div>
                    <div className="card-in">
                      <div className="card-top">
                        <div className="card-title">
                          <h3>{r.place.name}</h3>
                          <p className="times">
                            {fmt(r.arrive)}–{fmt(r.leave)} · spend {fmtDur(r.stop.dur)}
                            {r.stop.at && <span className="booked"> · {r.place.booking ? 'booked slot' : 'aim for'} {r.stop.at}</span>}
                          </p>
                        </div>
                        <label className="check" htmlFor={`done-${key}`}>
                          <input id={`done-${key}`} type="checkbox" checked={isDone} onChange={() => setDone((x) => ({ ...x, [key]: !x[key] }))} />
                          Done
                        </label>
                      </div>
                      <div className="chips">
                        <span className={`schip lv-${r.status.level}`}><b>{st.icon}</b> {r.status.text}</span>
                        {r.place.ticket && <span className="schip neutral">🎟 {r.place.ticket}</span>}
                        {r.place.booking && <span className="schip warn">Book ahead</span>}
                      </div>
                      {(r.status.level === 'tight' || r.status.level === 'late') && r.status.hoursText && <p className="hours-note">{r.status.hoursText}</p>}
                      {r.stop.tip && <p className="tip"><b>Tip</b> {r.stop.tip}</p>}
                      {d.about && <p className="about">{d.about}</p>}
                      {d.highlights?.length > 0 && (
                        <div className="block">
                          <h4>Don't miss</h4>
                          <ul className="hl">{d.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                        </div>
                      )}
                      {d.eat?.length > 0 && (
                        <div className="block eat">
                          <h4>Eat &amp; drink nearby</h4>
                          <ul>{d.eat.map((h) => <li key={h}>{h}</li>)}</ul>
                        </div>
                      )}
                      {r.place.info && <p className="info">{r.place.info}</p>}
                      <div className="card-links">
                        <a className="btn" href={directionsUrl(HOTEL, r.place, fromHotelMode)} target="_blank" rel="noreferrer">From hotel ↗</a>
                        <a className="btn ghost" href={placeUrl(r.place)} target="_blank" rel="noreferrer">On the map ↗</a>
                        {r.place.url && <a className="btn ghost" href={r.place.url} target="_blank" rel="noreferrer">Official site &amp; hours ↗</a>}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
          <li className="t-row t-end">
            <div className="t-time">{fmt(backAt)}</div>
            <div className="t-rail"><span className="t-node home">H</span></div>
            <div className="t-body">
              <div className="leg">
                <span className="leg-ico" aria-hidden="true">🏨</span>
                <span>Back to the hotel</span>
                {tl.rows.length > 0 && (
                  <a href={directionsUrl(tl.rows[tl.rows.length - 1].place, HOTEL, 'transit')} target="_blank" rel="noreferrer">Directions home ↗</a>
                )}
              </div>
            </div>
          </li>
        </ol>
      </section>

      {option.id === 'rome' && day.plan.dinner && (
        <section className="dinner">
          <h2 className="sec-title">Dinner idea</h2>
          <p>{day.plan.dinner}</p>
        </section>
      )}

      <nav className="day-nav">
        <button disabled={day.index === 0} onClick={() => go(day.index - 1)}>← {day.index > 0 ? trip[day.index - 1].label : ''}</button>
        <button onClick={() => go(-1)}>Overview</button>
        {todayIndex >= 0 && todayIndex !== day.index && <button onClick={() => go(todayIndex)}>Today</button>}
        <button disabled={day.index === trip.length - 1} onClick={() => go(day.index + 1)}>{day.index < trip.length - 1 ? trip[day.index + 1].label : ''} →</button>
      </nav>
      <p className="fine">
        Times are estimates. Opening hours are the usual November schedule and change often, so check the official site before you go.
        Weather is the typical November range, not a forecast.
      </p>
    </article>
  )
}
