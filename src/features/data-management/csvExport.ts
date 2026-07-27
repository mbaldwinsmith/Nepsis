import type {
  DailyCheckIn,
  SocialCommitment,
  ObserverEntry,
  MedicationDefinition,
  MedicationEntry,
  TransitionEvent,
  HealthMeasurement,
  AlertRule,
} from '../../data/schemas'

export interface CsvExportOptions {
  includeNotes: boolean
  includeObserverLabels: boolean
}

export interface CsvFile {
  filename: string
  content: string
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function formatCell(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (Array.isArray(value)) return value.join(';')
  return String(value)
}

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flatten(value as Record<string, unknown>, path))
    } else {
      out[path] = value
    }
  }
  return out
}

function collectHeaders(rows: Record<string, unknown>[]): string[] {
  const seen = new Set<string>()
  const headers: string[] = []
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key)
        headers.push(key)
      }
    }
  }
  return headers
}

/** Builds a CSV with one column per key seen across any row (order of first appearance). */
export function buildCsv(rows: Record<string, unknown>[]): string {
  const headers = collectHeaders(rows)
  const lines = [headers.map(escapeCsvField).join(',')]
  for (const row of rows) {
    lines.push(headers.map((header) => escapeCsvField(formatCell(row[header]))).join(','))
  }
  return lines.join('\r\n') + '\r\n'
}

function recordsToCsv(records: Record<string, unknown>[], omitFields: string[]): string {
  const flattenedRows = records.map((record) => {
    const flat = flatten(record)
    for (const field of omitFields) delete flat[field]
    return flat
  })
  return buildCsv(flattenedRows)
}

export function toDailyCheckInsCsv(
  records: DailyCheckIn[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes
    ? []
    : ['notes', 'medicationEffects.otherSideEffectText', 'urges.otherCompulsiveUrgeText']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toCommitmentsCsv(
  records: SocialCommitment[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes ? [] : ['note']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toObserverEntriesCsv(
  records: ObserverEntry[],
  options: CsvExportOptions,
): string {
  const omit = [
    ...(options.includeNotes ? [] : ['note']),
    ...(options.includeObserverLabels ? [] : ['observerLabel']),
  ]
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toMedicationDefinitionsCsv(
  records: MedicationDefinition[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes ? [] : ['notes']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toMedicationEntriesCsv(
  records: MedicationEntry[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes ? [] : ['notes']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toTransitionEventsCsv(
  records: TransitionEvent[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes ? [] : ['description']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toHealthMeasurementsCsv(
  records: HealthMeasurement[],
  options: CsvExportOptions,
): string {
  const omit = options.includeNotes ? [] : ['notes']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export function toAlertRulesCsv(records: AlertRule[], options: CsvExportOptions): string {
  const omit = options.includeNotes ? [] : ['description']
  return recordsToCsv(records as unknown as Record<string, unknown>[], omit)
}

export type ExportCategory =
  | 'dailyCheckIns'
  | 'commitments'
  | 'observerEntries'
  | 'medicationsAndTransitions'
  | 'healthMeasurements'
  | 'alerts'

export const EXPORT_CATEGORY_LABELS: Record<ExportCategory, string> = {
  dailyCheckIns: 'Daily check-ins',
  commitments: 'Commitments',
  observerEntries: 'Observer entries',
  medicationsAndTransitions: 'Medications and transition events',
  healthMeasurements: 'Health measurements',
  alerts: 'Alerts (rule configuration)',
}

const DICTIONARY_SECTIONS: Record<ExportCategory, string[]> = {
  dailyCheckIns: [
    'nepsis-daily-check-ins.csv — one row per self check-in.',
    'Dates are ISO 8601 (YYYY-MM-DD / full timestamp with offset).',
    'sleep.sleepDurationMinutes is in minutes; sleep/mood/appetite/urges/social ' +
      'fields are integer scales as defined in the app (see README for ranges).',
    'alcohol.unitsConsumed is in standard drink units as entered by the user.',
  ],
  commitments: [
    'nepsis-commitments.csv — one row per planned social/work/appointment commitment.',
    'plannedDate is an ISO date; outcome/reasons/notice describe what happened.',
  ],
  observerEntries: [
    'nepsis-observer-entries.csv — one row per observer (e.g. friend or family) check-in.',
    'observerLabel is the free-text name/role the user gave that observer, ' +
      'included only when "include observer labels" is checked.',
  ],
  medicationsAndTransitions: [
    'nepsis-medication-definitions.csv — medications the user has configured (reference data, not date-ranged).',
    'nepsis-medication-entries.csv — one row per dose event; takenAt is a full ISO timestamp.',
    'nepsis-transition-events.csv — one row per recorded transition event ' +
      '(dose change, appointment, illness, etc.); occurredAt is a full ISO timestamp.',
  ],
  healthMeasurements: [
    'nepsis-health-measurements.csv — one row per recorded measurement.',
    'value is a plain number; its unit is given in the "unit" column exactly as entered.',
    'referenceMin/referenceMax are the user-supplied reference range, if any.',
  ],
  alerts: [
    'nepsis-alerts.csv — the currently configured review rules (label, severity, ' +
      'lookback window, thresholds, enabled state).',
    'Nepsis does not keep a history of past fired alerts, so this file reflects ' +
      'current rule configuration only, not a log of past reviews.',
  ],
}

export function buildDataDictionary(
  categories: ExportCategory[],
  options: CsvExportOptions,
): string {
  const lines: string[] = [
    'Nepsis data export — data dictionary',
    '',
    `Notes included: ${options.includeNotes ? 'yes' : 'no'}`,
    `Observer labels included: ${options.includeObserverLabels ? 'yes' : 'no'}`,
    '',
  ]
  for (const category of categories) {
    lines.push(...DICTIONARY_SECTIONS[category], '')
  }
  return lines.join('\n')
}
