import { z } from 'zod'

/** Current schema version. Bump alongside a Dexie migration when a persisted shape changes. */
export const SCHEMA_VERSION = 1

export const id = () => z.string().min(1)

export const isoDate = () => z.iso.date()
export const isoDateTime = () => z.iso.datetime({ offset: true })

/** An inclusive integer scale, e.g. scale(0, 4) or scale(-2, 2). */
export const scale = (min: number, max: number) => z.number().int().min(min).max(max)

export const nonNegativeNumber = () => z.number().nonnegative()
export const nonNegativeInt = () => z.number().int().nonnegative()

export const optionalText = (maxLength = 2000) =>
  z.string().trim().min(1).max(maxLength).optional()
