import type { Table } from 'dexie'
import type { ZodType } from 'zod'
import { db } from '../db'
import {
  dailyCheckInSchema,
  socialCommitmentSchema,
  observerEntrySchema,
  medicationDefinitionSchema,
  medicationEntrySchema,
  transitionEventSchema,
  healthMeasurementSchema,
  personalBaselineSchema,
  safetyPlanSchema,
  alertRuleSchema,
  SCHEMA_VERSION,
  type DailyCheckIn,
  type SocialCommitment,
  type ObserverEntry,
  type MedicationDefinition,
  type MedicationEntry,
  type TransitionEvent,
  type HealthMeasurement,
  type PersonalBaseline,
  type SafetyPlan,
  type AlertRule,
} from '../schemas'
import {
  backupEnvelopeSchema,
  backupPayloadSchema,
  type BackupEnvelope,
  type BackupPayload,
  type BackupTableName,
} from './backupFormat'
import { decryptText } from './crypto'

export class InvalidBackupFileError extends Error {
  constructor(message = "This isn't a valid Nepsis backup file.") {
    super(message)
    this.name = 'InvalidBackupFileError'
  }
}

export class UnsupportedSchemaVersionError extends Error {
  constructor(schemaVersion: number) {
    super(
      `This backup was created with a newer version of Nepsis (data version ${schemaVersion}) than this app supports, so it can't be restored here.`,
    )
    this.name = 'UnsupportedSchemaVersionError'
  }
}

export class InvalidBackupRecordError extends Error {
  table: BackupTableName

  constructor(table: BackupTableName) {
    super(`This backup file contains an invalid record in "${table}".`)
    this.name = 'InvalidBackupRecordError'
    this.table = table
  }
}

/** Stage 1-2: parse the file and validate the outer (still-encrypted) envelope. */
export function parseBackupFile(fileText: string): BackupEnvelope {
  let json: unknown
  try {
    json = JSON.parse(fileText)
  } catch {
    throw new InvalidBackupFileError()
  }
  const result = backupEnvelopeSchema.safeParse(json)
  if (!result.success) throw new InvalidBackupFileError()
  return result.data
}

/** Stage 3-4: decrypt the envelope and validate the decrypted payload's shape and schema version. */
export async function decryptBackup(
  envelope: BackupEnvelope,
  passphrase: string,
): Promise<BackupPayload> {
  const plaintext = await decryptText(
    {
      saltBase64: envelope.kdf.saltBase64,
      ivBase64: envelope.cipher.ivBase64,
      ciphertextBase64: envelope.ciphertextBase64,
    },
    passphrase,
  )

  let json: unknown
  try {
    json = JSON.parse(plaintext)
  } catch {
    throw new InvalidBackupFileError()
  }
  const result = backupPayloadSchema.safeParse(json)
  if (!result.success) throw new InvalidBackupFileError()

  if (result.data.schemaVersion > SCHEMA_VERSION) {
    throw new UnsupportedSchemaVersionError(result.data.schemaVersion)
  }
  return result.data
}

export interface ValidatedBackupTables {
  dailyCheckIns: DailyCheckIn[]
  socialCommitments: SocialCommitment[]
  observerEntries: ObserverEntry[]
  medicationDefinitions: MedicationDefinition[]
  medicationEntries: MedicationEntry[]
  transitionEvents: TransitionEvent[]
  healthMeasurements: HealthMeasurement[]
  personalBaselines: PersonalBaseline[]
  safetyPlans: SafetyPlan[]
  alertRules: AlertRule[]
}

function parseAll<T>(
  table: BackupTableName,
  schema: ZodType<T>,
  records: unknown[],
): T[] {
  return records.map((record) => {
    const result = schema.safeParse(record)
    if (!result.success) throw new InvalidBackupRecordError(table)
    return result.data
  })
}

/** Stage 5: validate every record against its real entity schema before anything is written. */
export function validateBackupTables(payload: BackupPayload): ValidatedBackupTables {
  return {
    dailyCheckIns: parseAll(
      'dailyCheckIns',
      dailyCheckInSchema,
      payload.tables.dailyCheckIns,
    ),
    socialCommitments: parseAll(
      'socialCommitments',
      socialCommitmentSchema,
      payload.tables.socialCommitments,
    ),
    observerEntries: parseAll(
      'observerEntries',
      observerEntrySchema,
      payload.tables.observerEntries,
    ),
    medicationDefinitions: parseAll(
      'medicationDefinitions',
      medicationDefinitionSchema,
      payload.tables.medicationDefinitions,
    ),
    medicationEntries: parseAll(
      'medicationEntries',
      medicationEntrySchema,
      payload.tables.medicationEntries,
    ),
    transitionEvents: parseAll(
      'transitionEvents',
      transitionEventSchema,
      payload.tables.transitionEvents,
    ),
    healthMeasurements: parseAll(
      'healthMeasurements',
      healthMeasurementSchema,
      payload.tables.healthMeasurements,
    ),
    personalBaselines: parseAll(
      'personalBaselines',
      personalBaselineSchema,
      payload.tables.personalBaselines,
    ),
    safetyPlans: parseAll('safetyPlans', safetyPlanSchema, payload.tables.safetyPlans),
    alertRules: parseAll('alertRules', alertRuleSchema, payload.tables.alertRules),
  }
}

/** Stage 6: record counts to show the user before they commit to a restore. */
export function countBackupTables(
  tables: ValidatedBackupTables,
): Record<BackupTableName, number> {
  return {
    dailyCheckIns: tables.dailyCheckIns.length,
    socialCommitments: tables.socialCommitments.length,
    observerEntries: tables.observerEntries.length,
    medicationDefinitions: tables.medicationDefinitions.length,
    medicationEntries: tables.medicationEntries.length,
    transitionEvents: tables.transitionEvents.length,
    healthMeasurements: tables.healthMeasurements.length,
    personalBaselines: tables.personalBaselines.length,
    safetyPlans: tables.safetyPlans.length,
    alertRules: tables.alertRules.length,
  }
}

export type RestoreMode = 'replaceAll' | 'merge'

async function addUnseenOnly<T extends { id: string }>(
  table: Table<T, string>,
  records: T[],
): Promise<void> {
  const existingIds = new Set(await table.toCollection().primaryKeys())
  const unseen = records.filter((record) => !existingIds.has(record.id))
  if (unseen.length > 0) await table.bulkAdd(unseen)
}

const allTables = [
  db.dailyCheckIns,
  db.socialCommitments,
  db.observerEntries,
  db.medicationDefinitions,
  db.medicationEntries,
  db.transitionEvents,
  db.healthMeasurements,
  db.personalBaselines,
  db.safetyPlans,
  db.alertRules,
]

/**
 * Stage 7-8: commit already-validated records to IndexedDB inside a single
 * transaction, so a mid-way Dexie failure rolls back rather than leaving
 * partial data. All schema validation has already happened in
 * validateBackupTables, before this function is ever called.
 */
export async function commitRestore(
  tables: ValidatedBackupTables,
  mode: RestoreMode,
): Promise<void> {
  await db.transaction('rw', allTables, async () => {
    if (mode === 'replaceAll') {
      await Promise.all(allTables.map((table) => table.clear()))
      await Promise.all([
        db.dailyCheckIns.bulkAdd(tables.dailyCheckIns),
        db.socialCommitments.bulkAdd(tables.socialCommitments),
        db.observerEntries.bulkAdd(tables.observerEntries),
        db.medicationDefinitions.bulkAdd(tables.medicationDefinitions),
        db.medicationEntries.bulkAdd(tables.medicationEntries),
        db.transitionEvents.bulkAdd(tables.transitionEvents),
        db.healthMeasurements.bulkAdd(tables.healthMeasurements),
        db.personalBaselines.bulkAdd(tables.personalBaselines),
        db.safetyPlans.bulkAdd(tables.safetyPlans),
        db.alertRules.bulkAdd(tables.alertRules),
      ])
    } else {
      await Promise.all([
        addUnseenOnly(db.dailyCheckIns, tables.dailyCheckIns),
        addUnseenOnly(db.socialCommitments, tables.socialCommitments),
        addUnseenOnly(db.observerEntries, tables.observerEntries),
        addUnseenOnly(db.medicationDefinitions, tables.medicationDefinitions),
        addUnseenOnly(db.medicationEntries, tables.medicationEntries),
        addUnseenOnly(db.transitionEvents, tables.transitionEvents),
        addUnseenOnly(db.healthMeasurements, tables.healthMeasurements),
        addUnseenOnly(db.personalBaselines, tables.personalBaselines),
        addUnseenOnly(db.safetyPlans, tables.safetyPlans),
        addUnseenOnly(db.alertRules, tables.alertRules),
      ])
    }
  })
}
