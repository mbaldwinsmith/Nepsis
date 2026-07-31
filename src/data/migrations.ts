/**
 * Migration history for the Dexie schema in db.ts.
 *
 * Every future schema change must:
 * 1. add a new `this.version(n).stores({...}).upgrade(...)` block in db.ts
 *    (never edit a previously shipped version block);
 * 2. append an entry here describing what changed and why;
 * 3. bump SCHEMA_VERSION in data/schemas/shared.ts if the persisted record
 *    shape itself changed;
 * 4. add a migration test in src/data/__tests__/migrations.test.ts covering
 *    upgrade from the previous version;
 * 5. note backup/restore compatibility for the new version;
 * 6. record the change in release notes.
 *
 * When a shape change needs an actual data transform (not just an added
 * table), the transform function lives here too, as a pure function over a
 * raw (pre-validation) record — so it can be shared between db.ts's Dexie
 * `.upgrade()` (for records already on this device) and restore.ts (for
 * records arriving in an older backup file), rather than being written twice.
 */
export interface MigrationNote {
  dexieVersion: number
  schemaVersion: number
  summary: string
}

/**
 * Schema version 1 to 2: splits dailyCheckIns.medicationEffects.tremorOrStiffness
 * (a single combined 0-4 scale) into separate tremor and stiffness fields —
 * distinct extrapyramidal side effects worth tracking independently. Any
 * existing tremorOrStiffness value is carried into BOTH new fields, since
 * which one (or both) was meant cannot be recovered from a single combined
 * rating. A no-op for a record that isn't at schema version 1, or a version-1
 * record with no tremorOrStiffness value.
 */
export function migrateDailyCheckInV1ToV2(record: unknown): unknown {
  if (typeof record !== 'object' || record === null) return record
  const r = record as Record<string, unknown>
  if (r.schemaVersion !== 1) return record

  const rawEffects = r.medicationEffects
  const effects =
    typeof rawEffects === 'object' && rawEffects !== null
      ? { ...(rawEffects as Record<string, unknown>) }
      : {}

  if ('tremorOrStiffness' in effects) {
    const value = effects.tremorOrStiffness
    effects.tremor = value
    effects.stiffness = value
    delete effects.tremorOrStiffness
  }

  return { ...r, schemaVersion: 2, medicationEffects: effects }
}

export const migrationHistory: MigrationNote[] = [
  {
    dexieVersion: 1,
    schemaVersion: 1,
    summary: 'Initial schema: all Phase 2 entities, one table per entity.',
  },
  {
    dexieVersion: 1,
    schemaVersion: 1,
    summary:
      'AlertRule shape finalized for the Phase 8 rule engine: the placeholder ' +
      'generic conditions[] (metric/comparator/threshold) field was replaced ' +
      'with ruleType (a fixed evaluator id) + params (named numeric ' +
      'thresholds). No Dexie version bump: the alertRules table has never ' +
      'held real records under the old shape (no seed data or UI wrote to ' +
      'it), so there is nothing to migrate.',
  },
  {
    dexieVersion: 2,
    schemaVersion: 1,
    summary:
      'Added the appPreferences table (Phase 12): a single device-local ' +
      'record holding UI preferences such as the privacy curtain toggle. ' +
      'Deliberately excluded from encrypted backup/restore — it describes ' +
      "this device's screen behaviour, not portable personal data.",
  },
  {
    dexieVersion: 3,
    schemaVersion: 2,
    summary:
      'Split medicationEffects.tremorOrStiffness into separate tremor and ' +
      'stiffness fields (see migrateDailyCheckInV1ToV2 above). No Dexie ' +
      'index changed, so this version bump exists purely to run that data ' +
      'transform via an .upgrade() callback on every dailyCheckIns record. ' +
      'The same function is applied to older-schema-version records ' +
      'encountered during backup restore, so a pre-split backup restores ' +
      'cleanly rather than being rejected.',
  },
]
