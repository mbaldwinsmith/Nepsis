import Dexie, { type Table } from 'dexie'
import type {
  DailyCheckIn,
  SocialCommitment,
  ObserverEntry,
  MedicationDefinition,
  MedicationEntry,
  TransitionEvent,
  HealthMeasurement,
  PersonalBaseline,
  SafetyPlan,
  AlertRule,
} from './schemas'

export class NepsisDatabase extends Dexie {
  dailyCheckIns!: Table<DailyCheckIn, string>
  socialCommitments!: Table<SocialCommitment, string>
  observerEntries!: Table<ObserverEntry, string>
  medicationDefinitions!: Table<MedicationDefinition, string>
  medicationEntries!: Table<MedicationEntry, string>
  transitionEvents!: Table<TransitionEvent, string>
  healthMeasurements!: Table<HealthMeasurement, string>
  personalBaselines!: Table<PersonalBaseline, string>
  safetyPlans!: Table<SafetyPlan, string>
  alertRules!: Table<AlertRule, string>

  constructor(name = 'nepsis') {
    super(name)

    // Schema version 1. Any future field or table change must add a new
    // Dexie .version() block here rather than editing this one, plus a
    // corresponding entry in migrations.ts and a bump to SCHEMA_VERSION.
    this.version(1).stores({
      dailyCheckIns: 'id, entryDate, recordedAt, updatedAt',
      socialCommitments: 'id, plannedDate, outcome, type',
      observerEntries: 'id, observationDate, concern',
      medicationDefinitions: 'id, name',
      medicationEntries: 'id, medicationDefinitionId, takenAt, status',
      transitionEvents: 'id, occurredAt, type',
      healthMeasurements: 'id, type, measuredAt',
      personalBaselines: 'id',
      safetyPlans: 'id',
      alertRules: 'id, source',
    })
  }
}

export const db = new NepsisDatabase()

/** Clears every table. Used by the Settings "delete all data" action. */
export async function deleteAllLocalData(): Promise<void> {
  await db.transaction(
    'rw',
    [
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
    ],
    async () => {
      await Promise.all([
        db.dailyCheckIns.clear(),
        db.socialCommitments.clear(),
        db.observerEntries.clear(),
        db.medicationDefinitions.clear(),
        db.medicationEntries.clear(),
        db.transitionEvents.clear(),
        db.healthMeasurements.clear(),
        db.personalBaselines.clear(),
        db.safetyPlans.clear(),
        db.alertRules.clear(),
      ])
    },
  )
}
