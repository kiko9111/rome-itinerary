// Offline support: the app shell is cached on first visit; photos and map tiles are cached as you view them.
const SHELL = 'rome-shell-v1'
const MEDIA = 'rome-media-v1'
const MEDIA_LIMIT = 600

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './manifest.webmanifest', './icon-192.png', './icon-512.png'])))
  self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![SHELL, MEDIA].includes(k)).map((k) => caches.delete(k)))))
  self.clients.claim()
})

async function trim() {
  const c = await caches.open(MEDIA)
  const keys = await c.keys()
  for (let i = 0; i < keys.length - MEDIA_LIMIT; i++) await c.delete(keys[i])
}

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // Pages: network first, fall back to the cached app when offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone(); caches.open(SHELL).then((c) => c.put('./', copy)); return res
    }).catch(() => caches.match('./')))
    return
  }
  // Photos and map tiles: cache first.
  if (/wikimedia\.org$|tile\.openstreetmap\.org$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(MEDIA).then((c) => c.put(req, copy)).then(trim) }
      return res
    })))
    return
  }
  // App files (hashed JS/CSS, icons): cache first, then network.
  if (url.origin === self.location.origin) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone(); caches.open(SHELL).then((c) => c.put(req, copy)); return res
    })))
  }
})
