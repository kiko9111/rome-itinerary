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
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)

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
  if (hidden || (!prompt && !ios)) return null
  return (
    <div className="install wrap">
      {prompt ? (
        <>
          <span>📲 Install <b>Rome 19</b> on your phone: home-screen icon, full screen, works offline.</span>
          <button className="btn" onClick={async () => { prompt.prompt(); await prompt.userChoice; setPrompt(null) }}>Install app</button>
        </>
      ) : (
        <span>📲 To install on iPhone: tap <b>Share</b> <span aria-hidden="true">⬆︎</span> in Safari, then <b>Add to Home Screen</b>.</span>
      )}
      <button className="link-btn" onClick={hide}>Hide</button>
    </div>
  )
}
