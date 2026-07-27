import { useState } from 'react'
import { TextField } from '../../components/TextField'
import { CheckboxField } from '../../components/CheckboxField'
import { useToast } from '../../components/toastContext'
import { todayIsoDate } from '../../utils/date'
import { triggerDownloads } from '../../utils/download'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  observerEntryRepository,
  medicationDefinitionRepository,
  medicationEntryRepository,
  transitionEventRepository,
  healthMeasurementRepository,
  alertRuleRepository,
} from '../../data/repositories'
import {
  toDailyCheckInsCsv,
  toCommitmentsCsv,
  toObserverEntriesCsv,
  toMedicationDefinitionsCsv,
  toMedicationEntriesCsv,
  toTransitionEventsCsv,
  toHealthMeasurementsCsv,
  toAlertRulesCsv,
  buildDataDictionary,
  EXPORT_CATEGORY_LABELS,
  type ExportCategory,
  type CsvExportOptions,
} from './csvExport'

function withinRange(isoDateTime: string, start: string, end: string): boolean {
  const date = isoDateTime.slice(0, 10)
  if (start && date < start) return false
  if (end && date > end) return false
  return true
}

const ALL_CATEGORIES: ExportCategory[] = [
  'dailyCheckIns',
  'commitments',
  'observerEntries',
  'medicationsAndTransitions',
  'healthMeasurements',
  'alerts',
]

export function ExportCsvSection() {
  const { showToast } = useToast()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [categories, setCategories] = useState<Record<ExportCategory, boolean>>({
    dailyCheckIns: true,
    commitments: true,
    observerEntries: true,
    medicationsAndTransitions: true,
    healthMeasurements: true,
    alerts: true,
  })
  const [includeNotes, setIncludeNotes] = useState(true)
  const [includeObserverLabels, setIncludeObserverLabels] = useState(true)
  const [exporting, setExporting] = useState(false)

  function toggleCategory(category: ExportCategory, checked: boolean) {
    setCategories((prev) => ({ ...prev, [category]: checked }))
  }

  async function handleExport() {
    const selected = ALL_CATEGORIES.filter((c) => categories[c])
    if (selected.length === 0) {
      showToast('Choose at least one category to export', 'error')
      return
    }

    setExporting(true)
    try {
      const options: CsvExportOptions = { includeNotes, includeObserverLabels }
      const stamp = todayIsoDate()
      const files: { filename: string; content: string; mimeType?: string }[] = []

      if (categories.dailyCheckIns) {
        const records =
          startDate || endDate
            ? await dailyCheckInRepository.listByDateRange(
                startDate || '0000-01-01',
                endDate || '9999-12-31',
              )
            : await dailyCheckInRepository.list()
        files.push({
          filename: `nepsis-daily-check-ins-${stamp}.csv`,
          content: toDailyCheckInsCsv(records, options),
          mimeType: 'text/csv',
        })
      }

      if (categories.commitments) {
        const records =
          startDate || endDate
            ? await socialCommitmentRepository.listByDateRange(
                startDate || '0000-01-01',
                endDate || '9999-12-31',
              )
            : await socialCommitmentRepository.list()
        files.push({
          filename: `nepsis-commitments-${stamp}.csv`,
          content: toCommitmentsCsv(records, options),
          mimeType: 'text/csv',
        })
      }

      if (categories.observerEntries) {
        const records =
          startDate || endDate
            ? await observerEntryRepository.listByDateRange(
                startDate || '0000-01-01',
                endDate || '9999-12-31',
              )
            : await observerEntryRepository.list()
        files.push({
          filename: `nepsis-observer-entries-${stamp}.csv`,
          content: toObserverEntriesCsv(records, options),
          mimeType: 'text/csv',
        })
      }

      if (categories.medicationsAndTransitions) {
        const [definitions, entries, transitions] = await Promise.all([
          medicationDefinitionRepository.list(),
          medicationEntryRepository.list(),
          transitionEventRepository.listChronological(),
        ])
        const filteredEntries = entries.filter((e) =>
          withinRange(e.takenAt, startDate, endDate),
        )
        const filteredTransitions = transitions.filter((t) =>
          withinRange(t.occurredAt, startDate, endDate),
        )
        files.push(
          {
            filename: `nepsis-medication-definitions-${stamp}.csv`,
            content: toMedicationDefinitionsCsv(definitions, options),
            mimeType: 'text/csv',
          },
          {
            filename: `nepsis-medication-entries-${stamp}.csv`,
            content: toMedicationEntriesCsv(filteredEntries, options),
            mimeType: 'text/csv',
          },
          {
            filename: `nepsis-transition-events-${stamp}.csv`,
            content: toTransitionEventsCsv(filteredTransitions, options),
            mimeType: 'text/csv',
          },
        )
      }

      if (categories.healthMeasurements) {
        const all = await healthMeasurementRepository.list()
        const filtered = all.filter((m) => withinRange(m.measuredAt, startDate, endDate))
        files.push({
          filename: `nepsis-health-measurements-${stamp}.csv`,
          content: toHealthMeasurementsCsv(filtered, options),
          mimeType: 'text/csv',
        })
      }

      if (categories.alerts) {
        const rules = await alertRuleRepository.list()
        files.push({
          filename: `nepsis-alerts-${stamp}.csv`,
          content: toAlertRulesCsv(rules, options),
          mimeType: 'text/csv',
        })
      }

      files.push({
        filename: `nepsis-data-dictionary-${stamp}.txt`,
        content: buildDataDictionary(selected, options),
      })

      triggerDownloads(files)
      showToast('Export downloaded', 'success')
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="card stack">
      <h2>Export as CSV</h2>
      <p className="hint">
        Downloads one CSV file per category, plus a data dictionary explaining each
        file&apos;s columns and units. Leave the date range blank to export everything.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <TextField
          label="Start date"
          type="date"
          value={startDate}
          onChange={setStartDate}
        />
        <TextField label="End date" type="date" value={endDate} onChange={setEndDate} />
      </div>

      <div className="stack">
        {ALL_CATEGORIES.map((category) => (
          <CheckboxField
            key={category}
            label={EXPORT_CATEGORY_LABELS[category]}
            checked={categories[category]}
            onChange={(checked) => toggleCategory(category, checked)}
          />
        ))}
      </div>

      <CheckboxField
        label="Include free-text notes"
        checked={includeNotes}
        onChange={setIncludeNotes}
      />
      <CheckboxField
        label="Include observer labels"
        checked={includeObserverLabels}
        onChange={setIncludeObserverLabels}
        hint="The name or role you gave each observer (e.g. a friend or family member)."
      />

      <button type="button" className="btn" onClick={handleExport} disabled={exporting}>
        {exporting ? 'Exporting…' : 'Export CSV'}
      </button>
    </section>
  )
}
