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
 */
export interface MigrationNote {
  dexieVersion: number
  schemaVersion: number
  summary: string
}

export const migrationHistory: MigrationNote[] = [
  {
    dexieVersion: 1,
    schemaVersion: 1,
    summary: 'Initial schema: all Phase 2 entities, one table per entity.',
  },
]
