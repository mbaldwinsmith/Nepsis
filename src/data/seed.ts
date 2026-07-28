import { db } from './db'
import {
  SCHEMA_VERSION,
  type DailyCheckIn,
  type SocialCommitment,
  type ObserverEntry,
  type MedicationDefinition,
  type MedicationEntry,
  type TransitionEvent,
  type HealthMeasurement,
  type PersonalBaseline,
} from './schemas'
import { SINGLETON_BASELINE_ID } from './repositories/personalBaselineRepository'

/**
 * Realistic but entirely fictional development fixtures. Never seed the
 * project owner's real history, names, contacts, doses, or laboratory
 * values — see TASKS.md "Seed data".
 */

function daysAgoIso(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function atHour(dateIso: string, hour: number): string {
  return new Date(`${dateIso}T${String(hour).padStart(2, '0')}:00:00`).toISOString()
}

function checkIn(
  daysAgo: number,
  partial: Partial<
    Omit<DailyCheckIn, 'id' | 'schemaVersion' | 'entryDate' | 'recordedAt' | 'updatedAt'>
  >,
): DailyCheckIn {
  const entryDate = daysAgoIso(daysAgo)
  const recordedAt = atHour(entryDate, 21)
  return {
    id: crypto.randomUUID(),
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

function buildCheckIns(): DailyCheckIn[] {
  const entries: DailyCheckIn[] = []

  // Stable baseline: days 13-10 ago
  for (const d of [13, 12, 11, 10]) {
    entries.push(
      checkIn(d, {
        sleep: { sleepDurationMinutes: 440, sleepQuality: 3, lunchtimeNapNeed: 1 },
        mood: {
          lowMood: 1,
          elevatedMood: 0,
          energy: 2,
          mentalSpeed: 0,
          goalDirectedActivity: 2,
        },
        appetite: { appetite: 2, satietyAfterNormalMeal: 3 },
        social: { activityAmount: 2, socialDrive: 0, effect: 'neutral' },
      }),
    )
  }

  // day 9 ago intentionally missing (no entry) to demonstrate missing-data handling

  // Possible activation pattern: days 8-6 ago
  for (const d of [8, 7, 6]) {
    entries.push(
      checkIn(d, {
        sleep: { sleepDurationMinutes: 300, sleepQuality: 3, reducedNeedForSleep: 2 },
        mood: {
          elevatedMood: 3,
          energy: 4,
          mentalSpeed: 2,
          goalDirectedActivity: 4,
          irritability: 1,
        },
        warningSigns: { pressuredSpeech: true, unusualIdeas: true },
        social: {
          activityAmount: 4,
          socialDrive: 2,
          effect: 'energisedOrOverstimulated',
        },
      }),
    )
  }

  // Possible low-energy / withdrawal pattern: days 5-3 ago
  for (const d of [5, 4, 3]) {
    entries.push(
      checkIn(d, {
        sleep: {
          sleepDurationMinutes: 480,
          sleepQuality: 2,
          lunchtimeNapNeed: 3,
          napTaken: true,
          napDurationMinutes: 45,
          napEffect: 'unchanged',
        },
        mood: { lowMood: 3, energy: 1, goalDirectedActivity: 1 },
        social: { activityAmount: 1, socialDrive: -1, effect: 'depleted' },
      }),
    )
  }

  // Increased inner restlessness: 2 days ago
  entries.push(
    checkIn(2, {
      sleep: { sleepDurationMinutes: 400, sleepQuality: 2 },
      mood: { anxiety: 2, energy: 2 },
      medicationEffects: { innerRestlessness: 3, tremorOrStiffness: 1 },
    }),
  )

  // Increased appetite with reduced satiety: yesterday
  entries.push(
    checkIn(1, {
      appetite: {
        appetite: 4,
        hungerBetweenMeals: 3,
        satietyAfterNormalMeal: 1,
        foodPreoccupationOrCravings: 2,
      },
      mood: { lowMood: 1, energy: 2 },
      alcohol: { unitsConsumed: 3, context: 'social', perceivedEffect: 'neutral' },
    }),
  )

  // Improved appetite and satiety (the opposite direction): today
  entries.push(
    checkIn(0, {
      appetite: {
        appetite: 1,
        hungerBetweenMeals: 0,
        satietyAfterNormalMeal: 4,
      },
      mood: { lowMood: 0, energy: 3 },
    }),
  )

  return entries
}

function buildBaseline(): PersonalBaseline {
  return {
    id: SINGLETON_BASELINE_ID,
    schemaVersion: SCHEMA_VERSION,
    usualSleepDurationMinutes: 440,
    usualSleepQuality: 3,
    usualLunchtimeNapNeed: 1,
    usualWeeklyAlcoholUnits: 4,
    usualSocialActivity: 2,
    usualSocialDrive: 0,
    usualAppetite: 2,
    usualSatiety: 3,
    usualEnergy: 2,
    usualLowMood: 1,
    usualElevatedMood: 0,
    comparisonWindowDays: 14,
    baselineStartDate: daysAgoIso(13),
    baselineEndDate: daysAgoIso(10),
    notes: 'Derived from a stable four-day stretch — fictional development data.',
  }
}

function buildCommitments(): SocialCommitment[] {
  const now = new Date().toISOString()
  return [
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      plannedDate: daysAgoIso(7),
      title: 'Church service',
      type: 'church',
      importance: 'meaningful',
      outcome: 'cancelled',
      reasons: ['distress'],
      notice: 'sameDay',
      afterEffect: 'disappointed',
      note: 'Felt too overwhelmed to go.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      plannedDate: daysAgoIso(4),
      title: 'Team meeting',
      type: 'work',
      importance: 'essential',
      outcome: 'didNotAttend',
      reasons: ['distress', 'lowEnergy'],
      notice: 'veryLate',
      afterEffect: 'ashamed',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      plannedDate: daysAgoIso(6),
      title: 'Evening drinks with colleagues',
      type: 'friends',
      importance: 'routine',
      outcome: 'cancelled',
      reasons: ['healthyBoundary'],
      notice: 'early',
      afterEffect: 'gladIProtectedMyCapacity',
      note: 'Chose an early night instead.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      plannedDate: daysAgoIso(11),
      title: 'Lunch with a friend',
      type: 'friends',
      importance: 'routine',
      outcome: 'attended',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      plannedDate: daysAgoIso(-2),
      title: 'Dentist appointment',
      type: 'appointment',
      importance: 'meaningful',
      outcome: 'planned',
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function buildObserverEntries(): ObserverEntry[] {
  return [
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      observationDate: daysAgoIso(7),
      recordedAt: atHour(daysAgoIso(7), 20),
      observerLabel: 'Partner',
      perceivedMood: 'elevated',
      speech: 'faster',
      activity: 'unusuallyDriven',
      irritability: 1,
      restlessness: 1,
      concern: 'discussSoon',
      note: 'Talked very quickly about several new projects this evening.',
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      observationDate: daysAgoIso(3),
      recordedAt: atHour(daysAgoIso(3), 19),
      observerLabel: 'Friend A',
      perceivedMood: 'low',
      activity: 'withdrawn',
      concern: 'none',
      note: 'Quieter than usual but seemed okay.',
    },
  ]
}

function buildMedication(): {
  definition: MedicationDefinition
  entries: MedicationEntry[]
  events: TransitionEvent[]
} {
  const now = new Date().toISOString()
  const definition: MedicationDefinition = {
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    name: 'Sample medication A',
    formulation: '10mg tablet',
    active: true,
    createdAt: now,
    updatedAt: now,
  }

  const entries: MedicationEntry[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((d) => ({
    id: crypto.randomUUID(),
    schemaVersion: SCHEMA_VERSION,
    medicationDefinitionId: definition.id,
    takenAt: atHour(daysAgoIso(d), 8),
    doseTaken: 10,
    unit: 'mg',
    status: d === 4 ? 'delayed' : 'taken',
  }))

  const events: TransitionEvent[] = [
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      occurredAt: atHour(daysAgoIso(9), 9),
      type: 'doseIncreased',
      title: 'Dose increased to 10mg (agreed with prescriber)',
      linkedMedicationDefinitionId: definition.id,
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      occurredAt: atHour(daysAgoIso(2), 14),
      type: 'clinicianAppointment',
      title: 'Review appointment with prescriber',
    },
  ]

  return { definition, entries, events }
}

function buildHealthMeasurements(): HealthMeasurement[] {
  return [
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      type: 'weight',
      value: 78.2,
      unit: 'kg',
      measuredAt: atHour(daysAgoIso(10), 9),
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      type: 'alt',
      value: 28,
      unit: 'U/L',
      referenceMin: 7,
      referenceMax: 55,
      measuredAt: atHour(daysAgoIso(10), 9),
    },
    {
      id: crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      type: 'glucose',
      value: 7.4,
      unit: 'mmol/L',
      referenceMin: 4.0,
      referenceMax: 6.0,
      measuredAt: atHour(daysAgoIso(10), 9),
      notes: 'Fasting sample.',
    },
  ]
}

export async function loadSeedData(): Promise<void> {
  const checkIns = buildCheckIns()
  const commitments = buildCommitments()
  const observerEntries = buildObserverEntries()
  const { definition, entries: medicationEntries, events } = buildMedication()
  const measurements = buildHealthMeasurements()
  const baseline = buildBaseline()

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
    ],
    async () => {
      await db.dailyCheckIns.bulkPut(checkIns)
      await db.socialCommitments.bulkPut(commitments)
      await db.observerEntries.bulkPut(observerEntries)
      await db.medicationDefinitions.put(definition)
      await db.medicationEntries.bulkPut(medicationEntries)
      await db.transitionEvents.bulkPut(events)
      await db.healthMeasurements.bulkPut(measurements)
      await db.personalBaselines.put(baseline)
    },
  )
}
