import { useEffect, useState } from 'react'
import {
  dailyCheckInRepository,
  healthMeasurementRepository,
  personalBaselineRepository,
  socialCommitmentRepository,
  transitionEventRepository,
} from '../../data/repositories'
import type { SocialCommitment } from '../../data/schemas'
import { enumerateDates } from '../../utils/dateWindows'
import { metricDefinitions, type MetricKey, type TrendDataIndex } from './metrics'

export interface TrendSeries {
  key: MetricKey
  label: string
  unit: string | undefined
  min: number
  max: number
  points: { date: string; value: number | undefined }[]
  baselineValue: number | undefined
}

export interface EventMarker {
  date: string
  label: string
}

export function useTrendData(
  rangeStart: string,
  rangeEnd: string,
  selectedKeys: MetricKey[],
) {
  const [series, setSeries] = useState<TrendSeries[]>([])
  const [events, setEvents] = useState<EventMarker[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      dailyCheckInRepository.listByDateRange(rangeStart, rangeEnd),
      socialCommitmentRepository.listByDateRange(rangeStart, rangeEnd),
      healthMeasurementRepository.listByType('weight'),
      transitionEventRepository.listChronological(),
      personalBaselineRepository.getSingleton(),
    ]).then(([checkIns, commitments, weightMeasurements, allEvents, baseline]) => {
      if (cancelled) return

      const checkInsByDate = new Map(checkIns.map((c) => [c.entryDate, c]))

      const commitmentsByDate = new Map<string, SocialCommitment[]>()
      for (const commitment of commitments) {
        const list = commitmentsByDate.get(commitment.plannedDate) ?? []
        list.push(commitment)
        commitmentsByDate.set(commitment.plannedDate, list)
      }

      const weightByDate = new Map<string, number>()
      for (const measurement of weightMeasurements) {
        const date = measurement.measuredAt.slice(0, 10)
        if (date >= rangeStart && date <= rangeEnd) {
          weightByDate.set(date, measurement.value)
        }
      }

      const index: TrendDataIndex = { checkInsByDate, commitmentsByDate, weightByDate }
      const dates = enumerateDates(rangeStart, rangeEnd)

      const nextSeries: TrendSeries[] = selectedKeys.map((key) => {
        const def = metricDefinitions[key]
        return {
          key,
          label: def.label,
          unit: def.unit,
          min: def.min,
          max: def.max,
          points: dates.map((date) => ({ date, value: def.getValue(date, index) })),
          baselineValue:
            baseline && def.getBaseline ? def.getBaseline(baseline) : undefined,
        }
      })

      const nextEvents: EventMarker[] = allEvents
        .map((event) => ({ date: event.occurredAt.slice(0, 10), label: event.title }))
        .filter((event) => event.date >= rangeStart && event.date <= rangeEnd)

      setSeries(nextSeries)
      setEvents(nextEvents)
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [rangeStart, rangeEnd, selectedKeys])

  return { series, events, loading }
}
