import { useId, useState } from 'react'
import { TextField } from '../../components/TextField'
import { SegmentedControl } from '../../components/SegmentedControl'
import { useToast } from '../../components/toastContext'
import {
  parseBackupFile,
  decryptBackup,
  validateBackupTables,
  countBackupTables,
  commitRestore,
  type ValidatedBackupTables,
  type RestoreMode,
} from '../../data/backup/restore'
import { EXPORT_CATEGORY_LABELS } from './csvExport'

const TABLE_LABELS: Record<string, string> = {
  dailyCheckIns: EXPORT_CATEGORY_LABELS.dailyCheckIns,
  socialCommitments: EXPORT_CATEGORY_LABELS.commitments,
  observerEntries: EXPORT_CATEGORY_LABELS.observerEntries,
  medicationDefinitions: 'Medication definitions',
  medicationEntries: 'Medication entries',
  transitionEvents: 'Transition events',
  healthMeasurements: EXPORT_CATEGORY_LABELS.healthMeasurements,
  personalBaselines: 'Personal baseline',
  safetyPlans: 'Safety plan',
  alertRules: 'Review rules',
}

interface Preview {
  createdAt: string
  counts: Record<string, number>
  tables: ValidatedBackupTables
}

export function RestoreSection() {
  const fileInputId = useId()
  const { showToast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [mode, setMode] = useState<RestoreMode>('merge')
  const [busy, setBusy] = useState(false)

  function reset() {
    setPreview(null)
    setError(null)
  }

  async function handlePreview() {
    if (!file) {
      setError('Choose a backup file first.')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const text = await file.text()
      const envelope = parseBackupFile(text)
      const payload = await decryptBackup(envelope, passphrase)
      const tables = validateBackupTables(payload)
      setPreview({
        createdAt: payload.exportedAt,
        counts: countBackupTables(tables),
        tables,
      })
    } catch (err) {
      setPreview(null)
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read this backup file. Check that it is a Nepsis backup and that the passphrase is correct.',
      )
    } finally {
      setBusy(false)
    }
  }

  async function handleConfirm() {
    if (!preview) return
    setBusy(true)
    try {
      await commitRestore(preview.tables, mode)
      showToast('Restore complete', 'success')
      setFile(null)
      setPassphrase('')
      setPreview(null)
    } catch {
      setError("The restore didn't complete, and no data was changed. Please try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card stack">
      <h2>Restore from backup</h2>
      <p className="hint">
        Restores an encrypted backup file created by Nepsis. You&apos;ll see what it
        contains before anything is changed.
      </p>

      <div className="field">
        <label htmlFor={fileInputId}>Backup file</label>
        <input
          id={fileInputId}
          type="file"
          accept="application/json,.json"
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            reset()
          }}
        />
      </div>

      <TextField
        label="Passphrase"
        type="password"
        value={passphrase}
        onChange={(value) => {
          setPassphrase(value)
          reset()
        }}
      />

      {error && <p className="hint">{error}</p>}

      {!preview && (
        <button type="button" className="btn" onClick={handlePreview} disabled={busy}>
          {busy ? 'Checking…' : 'Preview backup'}
        </button>
      )}

      {preview && (
        <div className="stack">
          <p>
            Backup created {new Date(preview.createdAt).toLocaleString()}. It contains:
          </p>
          <ul>
            {Object.entries(preview.counts).map(([table, count]) => (
              <li key={table}>
                {TABLE_LABELS[table] ?? table}: {count}
              </li>
            ))}
          </ul>

          <SegmentedControl
            legend="What should happen to your existing data?"
            name="restoreMode"
            options={[
              { value: 'merge', label: 'Merge (keep existing)' },
              { value: 'replaceAll', label: 'Replace all' },
            ]}
            value={mode}
            onChange={setMode}
          />
          {mode === 'replaceAll' && (
            <p className="hint">
              This deletes everything currently stored in this browser and replaces it
              with the backup&apos;s contents.
            </p>
          )}
          {mode === 'merge' && (
            <p className="hint">
              Existing records are kept as-is; only records not already present are added.
            </p>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className={mode === 'replaceAll' ? 'btn btn-danger' : 'btn'}
              onClick={handleConfirm}
              disabled={busy}
            >
              {busy ? 'Restoring…' : 'Restore'}
            </button>
            <button type="button" className="btn" onClick={reset} disabled={busy}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
