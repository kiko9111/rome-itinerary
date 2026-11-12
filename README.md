# Rome in 19 days

A React app that walks you through Rome from Villa Marogni (Via Po 2), Thu 12 Nov to Mon 30 Nov 2026.

- Weekdays: evening plans that start after work (default 18:00, change it with the "Times" button).
- Weekends: full-day Rome plans, plus day-trip alternatives (Florence, Tivoli, Naples & Pompeii, Orvieto, Ostia Antica, Assisi).
- Every stop has Google Maps directions from the previous stop and from the hotel, plus an estimated arrival time
  checked against its November opening hours (green = fine, amber = tight, red = too late or closed).
- "Done" ticks, your day-trip choices and your times are saved in the browser.

## Real photos and street map

Every place shows a real photo from Wikimedia Commons, and each day has a live OpenStreetMap street map with numbered stops.
Both load from the internet. Where they can't load (offline, or inside a page that blocks outside images),
the app falls back to drawn illustrations and a drawn map.

## Run it

Needs Node 18+.

```
npm install
npm run dev          # open the printed http://localhost:5173 link
```

To open it on your phone on the same Wi-Fi: `npm run dev -- --host` and open the "Network" URL.

Build options:

```
npm run build        # normal static build in dist/ (host anywhere: Netlify, Vercel, GitHub Pages)
npm run build:single # one self-contained dist/index.html
```

## Edit the plan

All content is in `src/data.js`: places (coordinates, hours, tickets) and the 19 days in order.
Opening hours are typical winter hours; check the official links before going.
