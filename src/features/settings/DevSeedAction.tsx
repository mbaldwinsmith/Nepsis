import { useState } from 'react'
import { loadSeedData } from '../../data/seed'
import { useToast } from '../../components/toastContext'

/** Development-only action. Hidden from production builds via import.meta.env.DEV. */
export function DevSeedAction() {
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  if (!import.meta.env.DEV) return null

  async function handleClick() {
    setLoading(true)
    await loadSeedData()
    setLoading(false)
    showToast('Fictional seed data loaded', 'success')
  }

  return (
    <section className="card stack">
      <h2>Developer tools</h2>
      <p className="hint">Loads realistic but entirely fictional development data.</p>
      <button type="button" className="btn" onClick={handleClick} disabled={loading}>
        {loading ? 'Loading…' : 'Load seed data'}
      </button>
    </section>
  )
}
