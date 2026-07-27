import { nowIsoDateTime } from '../../utils/date'
import { SCHEMA_VERSION } from '../schemas'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  observerEntryRepository,
  medicationDefinitionRepository,
  medicationEntryRepository,
  transitionEventRepository,
  healthMeasurementRepository,
  personalBaselineRepository,
  safetyPlanRepository,
  alertRuleRepository,
} from '../repositories'
import { encryptText, PBKDF2_ITERATIONS } from './crypto'
import {
  BACKUP_FORMAT_VERSION,
  type BackupEnvelope,
  type BackupPayload,
} from './backupFormat'

/** A complete, unencrypted dump of every table — used by both backup and its tests. */
export async function buildBackupPayload(): Promise<BackupPayload> {
  const [
    dailyCheckIns,
    socialCommitments,
    observerEntries,
    medicationDefinitions,
    medicationEntries,
    transitionEvents,
    healthMeasurements,
    personalBaselines,
    safetyPlans,
    alertRules,
  ] = await Promise.all([
    dailyCheckInRepository.list(),
    socialCommitmentRepository.list(),
    observerEntryRepository.list(),
    medicationDefinitionRepository.list(),
    medicationEntryRepository.list(),
    transitionEventRepository.list(),
    healthMeasurementRepository.list(),
    personalBaselineRepository.list(),
    safetyPlanRepository.list(),
    alertRuleRepository.list(),
  ])

  return {
    schemaVersion: SCHEMA_VERSION,
    exportedAt: nowIsoDateTime(),
    tables: {
      dailyCheckIns,
      socialCommitments,
      observerEntries,
      medicationDefinitions,
      medicationEntries,
      transitionEvents,
      healthMeasurements,
      personalBaselines,
      safetyPlans,
      alertRules,
    },
  }
}

export async function createEncryptedBackup(passphrase: string): Promise<BackupEnvelope> {
  const payload = await buildBackupPayload()
  const encrypted = await encryptText(JSON.stringify(payload), passphrase)
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    schemaVersion: payload.schemaVersion,
    createdAt: payload.exportedAt,
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: PBKDF2_ITERATIONS,
      saltBase64: encrypted.saltBase64,
    },
    cipher: {
      name: 'AES-GCM',
      ivBase64: encrypted.ivBase64,
    },
    ciphertextBase64: encrypted.ciphertextBase64,
  }
}
