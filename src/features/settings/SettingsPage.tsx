import { Link } from 'react-router-dom'
import { useBaseline } from './useBaseline'
import { BaselineEditor } from './BaselineEditor'
import { DeleteAllData } from './DeleteAllData'
import { DevSeedAction } from './DevSeedAction'
import { usePrivacyCurtain } from './usePrivacyCurtain'
import { ToggleField } from '../../components/ToggleField'

export function SettingsPage() {
  const { baseline, loading, save } = useBaseline()
  const { enabled: privacyCurtainEnabled, setPrivacyCurtainEnabled } = usePrivacyCurtain()

  return (
    <div className="page stack">
      <h1>Settings</h1>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Review rules</h2>
        <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>
          Configure the deterministic, non-diagnostic patterns Nepsis can point out.
        </p>
        <Link to="/settings/rules" className="btn" style={{ textDecoration: 'none' }}>
          Manage review rules
        </Link>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Export, backup, and restore</h2>
        <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>
          Export CSV files, create an encrypted backup, or restore from one.
        </p>
        <Link to="/settings/data" className="btn" style={{ textDecoration: 'none' }}>
          Manage data
        </Link>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Install Nepsis</h2>
        <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>
          Add Nepsis to your home screen so it works offline.
        </p>
        <Link to="/settings/install" className="btn" style={{ textDecoration: 'none' }}>
          Install instructions
        </Link>
      </section>

      <section className="card">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Privacy</h2>
        <p className="hint" style={{ marginBottom: 'var(--space-3)' }}>
          What Nepsis stores, where, and what export, backup, and deletion actually do.
        </p>
        <Link to="/settings/privacy" className="btn" style={{ textDecoration: 'none' }}>
          Read the privacy summary
        </Link>
      </section>

      <section className="card stack">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Privacy curtain</h2>
        <ToggleField
          label="Show a cover screen when returning to Nepsis"
          checked={privacyCurtainEnabled}
          onChange={setPrivacyCurtainEnabled}
          hint="A plain screen appears after switching away and back, so a glance doesn't reveal your data. This is not a password or encryption — anyone can tap through it."
        />
      </section>

      {!loading && <BaselineEditor baseline={baseline} onSave={save} />}

      <DevSeedAction />
      <DeleteAllData />

      <p className="hint">Nepsis v{__APP_VERSION__}</p>
    </div>
  )
}
