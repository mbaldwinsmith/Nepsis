import { useEffect, useRef, useState } from 'react'
import { appPreferenceRepository } from '../data/repositories'

/**
 * A plain cover screen shown when the tab becomes visible again after being
 * hidden — a glance-deterrent for multitasking/screenshots, not a lock. It
 * has no PIN and does not encrypt anything; see /settings/privacy.
 */
export function PrivacyCurtain() {
  const [shown, setShown] = useState(false)
  const wasHidden = useRef(false)

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        wasHidden.current = true
        return
      }
      if (document.visibilityState === 'visible' && wasHidden.current) {
        wasHidden.current = false
        appPreferenceRepository.getSingleton().then((preference) => {
          if (preference.privacyCurtainEnabled) setShown(true)
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  if (!shown) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Privacy curtain. Tap to continue."
      onClick={() => setShown(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setShown(false)
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-4)',
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>Nepsis</span>
      <span className="hint">Tap to continue</span>
    </div>
  )
}
