import { useState } from 'react'
import { TextField } from '../../components/TextField'
import { useToast } from '../../components/toastContext'
import { todayIsoDate } from '../../utils/date'
import { triggerDownload } from '../../utils/download'
import { createEncryptedBackup } from '../../data/backup/createBackup'

const MIN_PASSPHRASE_LENGTH = 8

export function CreateBackupSection() {
  const { showToast } = useToast()
  const [passphrase, setPassphrase] = useState('')
  const [confirmPassphrase, setConfirmPassphrase] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    if (passphrase.length < MIN_PASSPHRASE_LENGTH) {
      setError(`Passphrase must be at least ${MIN_PASSPHRASE_LENGTH} characters.`)
      return
    }
    if (passphrase !== confirmPassphrase) {
      setError('Passphrases do not match.')
      return
    }
    setError(null)
    setCreating(true)
    try {
      const envelope = await createEncryptedBackup(passphrase)
      triggerDownload(
        `nepsis-backup-${todayIsoDate()}.json`,
        JSON.stringify(envelope, null, 2),
        'application/json',
      )
      setPassphrase('')
      setConfirmPassphrase('')
      showToast('Encrypted backup downloaded', 'success')
    } catch {
      showToast('Could not create your backup. Please try again.', 'error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="card stack">
      <h2>Encrypted backup</h2>
      <p>
        Creates a complete backup of everything stored in this browser, encrypted with a
        passphrase you choose. The downloaded file cannot be read as plain text without
        it.
      </p>
      <p className="hint">
        If you forget this passphrase, this backup cannot be recovered — Nepsis never
        stores it anywhere.
      </p>

      <TextField
        label="Passphrase"
        type="password"
        value={passphrase}
        onChange={setPassphrase}
      />
      <TextField
        label="Confirm passphrase"
        type="password"
        value={confirmPassphrase}
        onChange={setConfirmPassphrase}
      />
      {error && <p className="hint">{error}</p>}

      <button type="button" className="btn" onClick={handleCreate} disabled={creating}>
        {creating ? 'Creating…' : 'Create encrypted backup'}
      </button>
    </section>
  )
}
