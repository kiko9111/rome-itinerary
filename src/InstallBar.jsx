import { useEffect, useState } from 'react'
import { PHOTOS } from './photos.js'

// Shows "Install app" on Android/desktop Chrome, and Add-to-Home-Screen steps on iPhone.
export default function InstallBar() {
  const [prompt, setPrompt] = useState(null)
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem('rome.installHidden') === '1' } catch { return false }
  })
  const [saving, setSaving] = useState('')
  const standalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone)
  const ua = navigator.userAgent
  const ios = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  const android = /android/i.test(ua)
  // In-app browsers (Claude, WhatsApp, Instagram, Facebook, Gmail...) can't install apps.
  const inApp = /Claude|FBAN|FBAV|Instagram|WhatsApp|Line\/|GSA\/|wv\)|; wv/i.test(ua) || (ios && !/Safari\//.test(ua))
  const iosOtherBrowser = ios && /CriOS|FxiOS|EdgiOS/.test(ua)

  useEffect(() => {
    const on = (e) => { e.preventDefault(); setPrompt(e) }
    window.addEventListener('beforeinstallprompt', on)
    return () => window.removeEventListener('beforeinstallprompt', on)
  }, [])

  const saveOffline = async () => {
    const urls = Object.values(PHOTOS).map((p) => p.src)
    let n = 0
    setSaving(`Saving photos 0/${urls.length}…`)
    await Promise.all(urls.map((u) => fetch(u, { mode: 'no-cors' }).catch(() => {}).finally(() => { n++; setSaving(`Saving photos ${n}/${urls.length}…`) })))
    setSaving('Photos saved for offline use ✓')
  }
  const hide = () => { setHidden(true); try { localStorage.setItem('rome.installHidden', '1') } catch { /* ignore */ } }

  if (standalone) {
    return (
      <div className="install wrap">
        <span>📶 Going out of signal? Save every photo on this phone first.</span>
        <button className="pill-btn" onClick={saveOffline} disabled={!!saving && !saving.includes('✓')}>{saving || 'Save photos offline'}</button>
      </div>
    )
  }
  if (hidden) return null
  return (
    <div className="install wrap">
      {prompt ? (
        <>
          <span>📲 Install <b>Rome 19</b> on your phone: home-screen icon, full screen, works offline.</span>
          <button className="btn" onClick={async () => { prompt.prompt(); await prompt.userChoice; setPrompt(null) }}>Install app</button>
        </>
      ) : inApp ? (
        <span>📲 To install the app, open this page in {ios ? <b>Safari</b> : <b>Chrome</b>} first: tap the ⋯ or share menu and choose <b>Open in browser</b>. Then add it to your home screen.</span>
      ) : ios ? (
        <span>📲 Install on iPhone: in {iosOtherBrowser ? 'this browser' : 'Safari'} tap <b>Share</b> <span aria-hidden="true">⬆︎</span>, then <b>Add to Home Screen</b>.</span>
      ) : android ? (
        <span>📲 Install on Android: tap the Chrome menu <b>⋮</b> (top right), then <b>Add to Home screen</b> or <b>Install app</b>.</span>
      ) : (
        <span>📲 Install it: open your browser menu and choose <b>Install</b> or <b>Add to Home screen</b>.</span>
      )}
      <button className="link-btn" onClick={hide}>Hide</button>
    </div>
  )
}
