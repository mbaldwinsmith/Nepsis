import { ExportCsvSection } from './ExportCsvSection'
import { CreateBackupSection } from './CreateBackupSection'
import { RestoreSection } from './RestoreSection'

export function DataManagementPage() {
  return (
    <div className="page stack">
      <h1>Export, backup, and restore</h1>
      <p className="hint">
        Everything here creates a file you control. Nothing leaves this device unless you
        choose to move the downloaded file yourself.
      </p>
      <ExportCsvSection />
      <CreateBackupSection />
      <RestoreSection />
    </div>
  )
}
