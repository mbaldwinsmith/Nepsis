import { Link } from 'react-router-dom'
import { useBaseline } from './useBaseline'
import { BaselineEditor } from './BaselineEditor'
import { DeleteAllData } from './DeleteAllData'
import { DevSeedAction } from './DevSeedAction'

export function SettingsPage() {
  const { baseline, loading, save } = useBaseline()

  return (
    <div className="page stack">
      <h1>Settings</h1>

      <section className="card">
        <h2 style={{ fontSize: '1rem' }}>Review rules</h2>
        <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>
          Configure the deterministic, non-diagnostic patterns Nepsis can point out.
        </p>
        <Link to="/settings/rules" className="btn" style={{ textDecoration: 'none' }}>
          Manage review rules
        </Link>
      </section>

      <section className="card stack">
        <h2>Privacy</h2>
        <p>
          Nepsis stores your data locally in this browser using IndexedDB. There is no
          account, no cloud sync, and no analytics. Exporting or backing up data creates a
          file you control. Deleting local data removes what is stored in this browser,
          but cannot delete files you have already exported.
        </p>
        <p className="hint">
          Local browser storage is not a replacement for device encryption or a secure
          screen lock.
        </p>
      </section>

      {!loading && <BaselineEditor baseline={baseline} onSave={save} />}

      <DevSeedAction />
      <DeleteAllData />
    </div>
  )
}
