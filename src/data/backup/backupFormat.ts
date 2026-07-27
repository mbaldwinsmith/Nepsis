import { z } from 'zod'

/**
 * Versions the backup *file envelope* itself, independent of the app's data
 * SCHEMA_VERSION (data/schemas/shared.ts) — the envelope shape and the
 * record shapes inside it can change on different schedules.
 */
export const BACKUP_FORMAT_VERSION = 1

export const backupEnvelopeSchema = z.object({
  formatVersion: z.literal(BACKUP_FORMAT_VERSION),
  schemaVersion: z.number().int().positive(),
  createdAt: z.iso.datetime({ offset: true }),
  kdf: z.object({
    name: z.literal('PBKDF2'),
    hash: z.literal('SHA-256'),
    iterations: z.number().int().positive(),
    saltBase64: z.string().min(1),
  }),
  cipher: z.object({
    name: z.literal('AES-GCM'),
    ivBase64: z.string().min(1),
  }),
  ciphertextBase64: z.string().min(1),
})

export type BackupEnvelope = z.infer<typeof backupEnvelopeSchema>

/**
 * Table contents are kept as z.unknown() here and validated record-by-record
 * against each entity's real Zod schema during restore (see restore.ts) —
 * that's what lets restore reject a corrupted or hand-edited record with a
 * precise error before anything is written to IndexedDB.
 */
export const backupTablesSchema = z.object({
  dailyCheckIns: z.array(z.unknown()),
  socialCommitments: z.array(z.unknown()),
  observerEntries: z.array(z.unknown()),
  medicationDefinitions: z.array(z.unknown()),
  medicationEntries: z.array(z.unknown()),
  transitionEvents: z.array(z.unknown()),
  healthMeasurements: z.array(z.unknown()),
  personalBaselines: z.array(z.unknown()),
  safetyPlans: z.array(z.unknown()),
  alertRules: z.array(z.unknown()),
})

export type BackupTables = z.infer<typeof backupTablesSchema>
export type BackupTableName = keyof BackupTables

export const backupPayloadSchema = z.object({
  schemaVersion: z.number().int().positive(),
  exportedAt: z.iso.datetime({ offset: true }),
  tables: backupTablesSchema,
})

export type BackupPayload = z.infer<typeof backupPayloadSchema>
