import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useToast } from '../components/toastContext'

export function UpdateNotice() {
  const { showToast } = useToast()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (offlineReady) {
      showToast('Nepsis is ready to work offline.', 'success')
      setOfflineReady(false)
    }
  }, [offlineReady, setOfflineReady, showToast])

  if (!needRefresh) return null

  return (
    <div
      role="status"
      className="card"
      style={{
        position: 'fixed',
        bottom: 'calc(var(--nav-height) + var(--space-3))',
        left: 'var(--space-3)',
        right: 'var(--space-3)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        flexWrap: 'wrap',
      }}
    >
      <p style={{ margin: 0 }}>A new version of Nepsis is ready.</p>
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <button type="button" className="btn" onClick={() => updateServiceWorker(true)}>
          Refresh now
        </button>
        <button type="button" className="btn" onClick={() => setNeedRefresh(false)}>
          Later
        </button>
      </div>
    </div>
  )
}
