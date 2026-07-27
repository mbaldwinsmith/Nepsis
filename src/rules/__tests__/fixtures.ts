import { SCHEMA_VERSION } from '../../data/schemas'
import type {
  DailyCheckIn,
  ObserverEntry,
  PersonalBaseline,
  SocialCommitment,
} from '../../data/schemas'

export function checkIn(
  entryDate: string,
  partial: Partial<
    Omit<DailyCheckIn, 'id' | 'schemaVersion' | 'entryDate' | 'recordedAt' | 'updatedAt'>
  > = {},
): DailyCheckIn {
  const recordedAt = `${entryDate}T21:00:00.000Z`
  return {
    id: `checkin-${entryDate}-${Math.random().toString(36).slice(2)}`,
    schemaVersion: SCHEMA_VERSION,
    entryDate,
    recordedAt,
    updatedAt: recordedAt,
    sleep: {},
    mood: {},
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    ...partial,
  }
}

export function commitment(
  plannedDate: string,
  partial: Partial<
    Omit<
      SocialCommitment,
      'id' | 'schemaVersion' | 'plannedDate' | 'createdAt' | 'updatedAt'
    >
  > = {},
): SocialCommitment {
  const now = `${plannedDate}T09:00:00.000Z`
  return {
    id: `commitment-${plannedDate}-${Math.random().toString(36).slice(2)}`,
    schemaVersion: SCHEMA_VERSION,
    plannedDate,
    type: 'friends',
    importance: 'routine',
    outcome: 'planned',
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}

export function observerEntry(
  observationDate: string,
  partial: Partial<
    Omit<ObserverEntry, 'id' | 'schemaVersion' | 'observationDate' | 'recordedAt'>
  > = {},
): ObserverEntry {
  return {
    id: `observer-${observationDate}-${Math.random().toString(36).slice(2)}`,
    schemaVersion: SCHEMA_VERSION,
    observationDate,
    recordedAt: `${observationDate}T20:00:00.000Z`,
    observerLabel: 'Friend A',
    concern: 'none',
    ...partial,
  }
}

export function baseline(
  partial: Partial<Omit<PersonalBaseline, 'id' | 'schemaVersion'>> = {},
): PersonalBaseline {
  return {
    id: 'personal-baseline',
    schemaVersion: SCHEMA_VERSION,
    ...partial,
  }
}
