import { useEffect, useState } from 'react'
import {
  dailyCheckInSchema,
  SCHEMA_VERSION,
  type Alcohol,
  type Appetite,
  type DailyCheckIn,
  type MedicationEffects,
  type Mood,
  type Sleep,
  type Social,
  type Urges,
  type WarningSigns,
} from '../../data/schemas'
import { dailyCheckInRepository } from '../../data/repositories'
import { todayIsoDate, nowIsoDateTime } from '../../utils/date'

export interface CheckInDraft {
  sleep: Sleep
  mood: Mood
  warningSigns: WarningSigns
  medicationEffects: MedicationEffects
  appetite: Appetite
  urges: Urges
  alcohol: Alcohol
  social: Social
  notes: string
}

const emptyDraft: CheckInDraft = {
  sleep: {},
  mood: {},
  warningSigns: {},
  medicationEffects: {},
  appetite: {},
  urges: {},
  alcohol: {},
  social: {},
  notes: '',
}

function toDraft(entry: DailyCheckIn): CheckInDraft {
  return {
    sleep: entry.sleep,
    mood: entry.mood,
    warningSigns: entry.warningSigns,
    medicationEffects: entry.medicationEffects,
    appetite: entry.appetite,
    urges: entry.urges,
    alcohol: entry.alcohol,
    social: entry.social,
    notes: entry.notes ?? '',
  }
}

export function useDailyCheckIn(entryDate: string = todayIsoDate()) {
  const [draft, setDraft] = useState<CheckInDraft>(emptyDraft)
  const [existing, setExisting] = useState<DailyCheckIn | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    dailyCheckInRepository.getByDate(entryDate).then((found) => {
      if (cancelled) return
      setExisting(found)
      setDraft(found ? toDraft(found) : emptyDraft)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [entryDate])

  async function save(): Promise<{ success: true } | { success: false; error: string }> {
    const now = nowIsoDateTime()
    const record: DailyCheckIn = {
      id: existing?.id ?? crypto.randomUUID(),
      schemaVersion: SCHEMA_VERSION,
      entryDate,
      recordedAt: existing?.recordedAt ?? now,
      updatedAt: now,
      notes: draft.notes.trim() === '' ? undefined : draft.notes.trim(),
      sleep: draft.sleep,
      mood: draft.mood,
      warningSigns: draft.warningSigns,
      medicationEffects: draft.medicationEffects,
      appetite: draft.appetite,
      urges: draft.urges,
      alcohol: draft.alcohol,
      social: draft.social,
    }

    const parsed = dailyCheckInSchema.safeParse(record)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? 'Could not save check-in',
      }
    }

    const saved = existing
      ? await dailyCheckInRepository.update(parsed.data)
      : await dailyCheckInRepository.create(parsed.data)
    setExisting(saved)
    return { success: true }
  }

  return { draft, setDraft, existing, loading, save }
}
