import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../db'
import { dailyCheckInRepository } from '../../repositories'
import { SCHEMA_VERSION } from '../../schemas'
import { checkIn } from '../../../rules/__tests__/fixtures'
import { encryptText } from '../crypto'
import { BACKUP_FORMAT_VERSION, type BackupEnvelope } from '../backupFormat'
import { createEncryptedBackup, buildBackupPayload } from '../createBackup'
import {
  parseBackupFile,
  decryptBackup,
  validateBackupTables,
  countBackupTables,
  commitRestore,
  InvalidBackupFileError,
  InvalidBackupRecordError,
  UnsupportedSchemaVersionError,
} from '../restore'
import { IncorrectPassphraseError } from '../crypto'

const PASSPHRASE = 'a strong passphrase'

beforeEach(async () => {
  await db.dailyCheckIns.clear()
  await db.socialCommitments.clear()
  await db.observerEntries.clear()
  await db.medicationDefinitions.clear()
  await db.medicationEntries.clear()
  await db.transitionEvents.clear()
  await db.healthMeasurements.clear()
  await db.personalBaselines.clear()
  await db.safetyPlans.clear()
  await db.alertRules.clear()
})

describe('parseBackupFile', () => {
  it('rejects text that is not valid JSON', () => {
    expect(() => parseBackupFile('not json')).toThrow(InvalidBackupFileError)
  })

  it('rejects JSON that is not a Nepsis backup envelope', () => {
    expect(() => parseBackupFile(JSON.stringify({ foo: 'bar' }))).toThrow(
      InvalidBackupFileError,
    )
  })
})

describe('decryptBackup', () => {
  it('rejects the wrong passphrase', async () => {
    const envelope = await createEncryptedBackup(PASSPHRASE)
    await expect(decryptBackup(envelope, 'wrong passphrase')).rejects.toThrow(
      IncorrectPassphraseError,
    )
  })

  it('rejects a payload from a newer, unsupported schema version', async () => {
    const payload = await buildBackupPayload()
    const futurePayload = { ...payload, schemaVersion: SCHEMA_VERSION + 1 }
    const encrypted = await encryptText(JSON.stringify(futurePayload), PASSPHRASE)
    const envelope: BackupEnvelope = {
      formatVersion: BACKUP_FORMAT_VERSION,
      schemaVersion: futurePayload.schemaVersion,
      createdAt: futurePayload.exportedAt,
      kdf: {
        name: 'PBKDF2' as const,
        hash: 'SHA-256' as const,
        iterations: 300_000,
        saltBase64: encrypted.saltBase64,
      },
      cipher: { name: 'AES-GCM' as const, ivBase64: encrypted.ivBase64 },
      ciphertextBase64: encrypted.ciphertextBase64,
    }
    await expect(decryptBackup(envelope, PASSPHRASE)).rejects.toThrow(
      UnsupportedSchemaVersionError,
    )
  })
})

describe('validateBackupTables', () => {
  it('rejects a payload containing an invalid record, naming the table', async () => {
    const payload = await buildBackupPayload()
    const tampered = {
      ...payload,
      tables: {
        ...payload.tables,
        dailyCheckIns: [{ id: 'bad', schemaVersion: SCHEMA_VERSION }],
      },
    }
    expect(() => validateBackupTables(tampered)).toThrow(InvalidBackupRecordError)
  })

  it('migrates a version-1 dailyCheckIn (tremorOrStiffness) before validating, so an older backup restores cleanly', async () => {
    const payload = await buildBackupPayload()
    payload.tables.dailyCheckIns = [
      {
        id: 'legacy-check-in',
        schemaVersion: 1,
        entryDate: '2026-01-01',
        recordedAt: '2026-01-01T09:00:00.000Z',
        updatedAt: '2026-01-01T09:00:00.000Z',
        sleep: {},
        mood: {},
        warningSigns: {},
        medicationEffects: { tremorOrStiffness: 2 },
        appetite: {},
        urges: {},
        alcohol: {},
        social: {},
      },
    ]

    const tables = validateBackupTables(payload)

    expect(tables.dailyCheckIns).toHaveLength(1)
    expect(tables.dailyCheckIns[0]?.schemaVersion).toBe(SCHEMA_VERSION)
    expect(tables.dailyCheckIns[0]?.medicationEffects).toEqual({
      tremor: 2,
      stiffness: 2,
    })
  })
})

describe('commitRestore', () => {
  it('replace-all clears existing data and writes the backup contents', async () => {
    await dailyCheckInRepository.create(checkIn('2026-01-01', { notes: 'original' }))

    const backupCheckIn = checkIn('2026-01-10', { notes: 'from backup' })
    const payload = await buildBackupPayload()
    payload.tables.dailyCheckIns = [backupCheckIn]
    const tables = validateBackupTables(payload)

    await commitRestore(tables, 'replaceAll')

    const all = await db.dailyCheckIns.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]?.notes).toBe('from backup')
  })

  it('merge keeps existing records untouched and adds only unseen ones', async () => {
    const existing = {
      ...checkIn('2026-01-01', { notes: 'kept as-is' }),
      id: 'shared-id',
    }
    await db.dailyCheckIns.add(existing)

    const conflicting = {
      ...checkIn('2026-01-01', { notes: 'from backup' }),
      id: 'shared-id',
    }
    const newRecord = {
      ...checkIn('2026-01-02', { notes: 'added by restore' }),
      id: 'new-id',
    }
    const payload = await buildBackupPayload()
    payload.tables.dailyCheckIns = [conflicting, newRecord]
    const tables = validateBackupTables(payload)

    await commitRestore(tables, 'merge')

    const all = await db.dailyCheckIns.toArray()
    expect(all).toHaveLength(2)
    expect(all.find((r) => r.id === 'shared-id')?.notes).toBe('kept as-is')
    expect(all.find((r) => r.id === 'new-id')?.notes).toBe('added by restore')
  })

  it('leaves existing data untouched when validation fails before commit', async () => {
    await dailyCheckInRepository.create(checkIn('2026-01-01', { notes: 'untouched' }))

    const payload = await buildBackupPayload()
    payload.tables.dailyCheckIns = [{ id: 'bad', schemaVersion: SCHEMA_VERSION }]

    expect(() => validateBackupTables(payload)).toThrow(InvalidBackupRecordError)
    const all = await db.dailyCheckIns.toArray()
    expect(all).toHaveLength(1)
    expect(all[0]?.notes).toBe('untouched')
  })
})

describe('full round trip', () => {
  it('parses, decrypts, validates, previews, and restores a real encrypted backup', async () => {
    await dailyCheckInRepository.create(checkIn('2026-01-05', { notes: 'roundtrip' }))
    const envelope = await createEncryptedBackup(PASSPHRASE)
    const fileText = JSON.stringify(envelope)

    await db.dailyCheckIns.clear()

    const parsedEnvelope = parseBackupFile(fileText)
    const payload = await decryptBackup(parsedEnvelope, PASSPHRASE)
    const tables = validateBackupTables(payload)
    const counts = countBackupTables(tables)
    expect(counts.dailyCheckIns).toBe(1)

    await commitRestore(tables, 'replaceAll')
    const all = await db.dailyCheckIns.toArray()
    expect(all[0]?.notes).toBe('roundtrip')
  })
})
