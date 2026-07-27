import type { Table } from 'dexie'
import type { ZodType } from 'zod'

/**
 * Shared CRUD behaviour for a single Dexie table. Every entity is validated
 * with its Zod schema before it reaches IndexedDB, so presentation code never
 * needs to (and never should) call Dexie directly.
 */
export function createRepository<T extends { id: string }>(
  table: Table<T, string>,
  schema: ZodType<T>,
) {
  return {
    async create(record: T): Promise<T> {
      const validated = schema.parse(record)
      await table.add(validated)
      return validated
    },
    async update(record: T): Promise<T> {
      const validated = schema.parse(record)
      await table.put(validated)
      return validated
    },
    async get(id: string): Promise<T | undefined> {
      return table.get(id)
    },
    async list(): Promise<T[]> {
      return table.toArray()
    },
    async remove(id: string): Promise<void> {
      await table.delete(id)
    },
    async clear(): Promise<void> {
      await table.clear()
    },
  }
}
