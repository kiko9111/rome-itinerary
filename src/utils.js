import { HOTEL, PLACES, TRIP_START, TRIP_DAYS, DAYS } from './data.js'

export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
export const fmt = (min) => {
  const m = Math.round(min)
  const h = Math.floor(m / 60) % 24
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Build the dated trip: one entry per day, starting at TRIP_START.
export function buildTrip() {
  const [y, mo, d] = TRIP_START.split('-').map(Number)
  return Array.from({ length: TRIP_DAYS }, (_, i) => {
    const date = new Date(Date.UTC(y, mo - 1, d + i))
    const dow = date.getUTCDay()
    const iso = date.toISOString().slice(0, 10)
    const plan = DAYS[i]
    const isWeekend = dow === 0 || dow === 6
    if (plan && (plan.type === 'weekend') !== isWeekend) {
      console.warn(`Day ${i + 1} (${iso}) is marked ${plan.type} but falls on ${WEEKDAYS[dow]}`)
    }
    return {
      index: i,
      iso,
      dow,
      isWeekend,
      label: `${WEEKDAYS[dow]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`,
      short: WEEKDAYS[dow],
      dayNum: date.getUTCDate(),
      plan: plan || { type: isWeekend ? 'weekend' : 'weekday', title: 'Free day', stops: [] },
    }
  })
}

export function todayIso() {
  // Rome local date
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(new Date())
}

function haversineKm(a, b) {
  const R = 6371
  const toRad = (x) => (x * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

const WALK_LIMIT_KM = 1.6

// Rough travel estimate inside a city. Google Maps links give the real thing.
export function estimateTravel(from, to) {
  const km = haversineKm(from, to)
  const routeKm = km * 1.3
  if (km < 0.05) return { mins: 0, mode: 'walking', label: 'right here', km }
  if (km <= WALK_LIMIT_KM) {
    const mins = Math.max(3, Math.round((routeKm / 4.8) * 60))
    return { mins, mode: 'walking', label: `~${mins} min walk`, km }
  }
  const mins = Math.round(10 + routeKm * 3.5)
  return { mins, mode: 'transit', label: `~${mins} min by bus/metro (or taxi)`, km }
}

const ll = (p) => `${p.lat},${p.lng}`

export function directionsUrl(from, to, mode = 'transit') {
  const q = new URLSearchParams({ api: '1', origin: ll(from), destination: ll(to), travelmode: mode })
  return `https://www.google.com/maps/dir/?${q.toString()}`
}

export function placeUrl(p) {
  const q = new URLSearchParams({ api: '1', query: ll(p) })
  return `https://www.google.com/maps/search/?${q.toString()}`
}

// Whole-day route through every stop (walking, because Google ignores waypoints for transit).
export function dayRouteUrl(stops) {
  if (!stops.length) return null
  const pts = stops.map((s) => PLACES[s.p])
  const last = pts[pts.length - 1]
  const waypoints = pts.slice(0, -1).slice(0, 9).map(ll).join('|')
  const q = new URLSearchParams({ api: '1', origin: ll(HOTEL), destination: ll(last), travelmode: 'walking' })
  if (waypoints) q.set('waypoints', waypoints)
  return `https://www.google.com/maps/dir/?${q.toString()}`
}

// Walk through the day's stops, estimating arrival times and checking opening hours.
export function computeTimeline(stops, dow, startMin) {
  let prev = HOTEL
  let t = startMin
  // If the first stop has a booked time, leave the hotel just in time for it.
  if (stops[0]?.at) {
    const first = PLACES[stops[0].p]
    const travel = stops[0].train ? stops[0].train.mins : estimateTravel(prev, first).mins
    t = toMin(stops[0].at) - travel
  }
  const departHotel = t
  const rows = stops.map((s, i) => {
    const place = PLACES[s.p]
    if (!place) throw new Error(`Unknown place id: ${s.p}`)
    const travel = s.train
      ? { mins: s.train.mins, mode: 'transit', label: `${s.train.label}, ~${fmtDur(s.train.mins)}`, train: true }
      : estimateTravel(prev, place)
    let arrive = t + travel.mins
    let waited = 0
    if (s.at && toMin(s.at) > arrive) {
      waited = toMin(s.at) - arrive
      arrive = toMin(s.at)
    }
    const status = checkHours(place, dow, arrive, s.dur)
    if (status.waitUntil) {
      waited += status.waitUntil - arrive
      arrive = status.waitUntil
    }
    const leave = arrive + s.dur
    const row = { stop: s, place, travel, from: prev, arrive, leave, waited, status, index: i }
    prev = place
    t = leave
    return row
  })
  return { departHotel, rows, end: t }
}

export function fmtDur(m) {
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  const r = m % 60
  return r ? `${h}h${String(r).padStart(2, '0')}` : `${h}h`
}

// level: ok | tight | late | closed | always
export function checkHours(place, dow, arrive, dur) {
  if (place.hours === 'always') return { level: 'always', text: 'Open any time' }
  const row = place.hours[dow]
  if (!row) return { level: 'closed', text: 'Closed today' }
  const [open, last, close] = row.map(toMin)
  const hoursText = `Open ${row[0]}–${row[2]} · last entry ${row[1]}`
  if (arrive > last) return { level: 'late', text: `Too late: last entry ${row[1]}`, hoursText }
  let waitUntil = null
  if (arrive < open) waitUntil = open
  const effective = waitUntil ?? arrive
  if (last - effective < 20) return { level: 'tight', text: `Tight: last entry ${row[1]}`, hoursText, waitUntil }
  if (effective + dur > close) return { level: 'tight', text: `Closes ${row[2]}, you'll have ${close - effective} min`, hoursText, waitUntil }
  return { level: 'ok', text: hoursText, hoursText, waitUntil }
}

// The plans available on a day: Rome first, then any day trips.
export function dayOptions(day) {
  return [{ id: 'rome', title: day.plan.title, stops: day.plan.stops }, ...(day.plan.alts || [])]
}
export function chosenOption(day, choices) {
  const opts = dayOptions(day)
  return opts.find((o) => o.id === choices[day.iso]) || opts[0]
}

// Rough ticket cost: the first euro amount in each stop's ticket text.
export function ticketEuros(place) {
  const m = /€\s?(\d+)/.exec(place.ticket || '')
  return m ? Number(m[1]) : 0
}
export function dayStats(rows) {
  const walkKm = rows.reduce((s, r) => s + (r.travel.mode === 'walking' && !r.travel.train ? (r.travel.km || 0) * 1.3 : 0), 0)
  const tickets = rows.reduce((s, r) => s + ticketEuros(r.place), 0)
  const sightMins = rows.reduce((s, r) => s + r.stop.dur, 0)
  return { walkKm, tickets, sightMins }
}
