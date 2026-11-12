// Sunrise/sunset for Rome (NOAA simplified algorithm), returned as minutes after local midnight.
// Rome is on CET (UTC+1) for the whole trip.
const LAT = 41.9
const LNG = 12.5
const TZ = 1

export function sunTimes(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = Date.UTC(y, m - 1, d)
  const start = Date.UTC(y, 0, 0)
  const N = Math.round((date - start) / 86400000)
  const rad = Math.PI / 180
  const g = (2 * Math.PI / 365) * (N - 1)
  const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
    - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g))
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g)
    + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g)
  const ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)) / rad
  const sunrise = 720 - 4 * (LNG + ha) - eqtime + TZ * 60
  const sunset = 720 - 4 * (LNG - ha) - eqtime + TZ * 60
  return { sunrise, sunset }
}

// Typical Rome weather across November (climate normals), interpolated by day of month.
export function typicalWeather(iso) {
  const day = Number(iso.slice(8, 10))
  const t = (day - 1) / 29
  const high = 18 - 3.5 * t
  const low = 9.5 - 3 * t
  return { high: Math.round(high), low: Math.round(low), rainChance: 33 }
}

export function skyMode(minutes, iso) {
  const { sunset, sunrise } = sunTimes(iso)
  if (minutes < sunrise + 20) return 'dusk'
  if (minutes < sunset - 50) return 'day'
  if (minutes < sunset + 25) return 'dusk'
  return 'night'
}
