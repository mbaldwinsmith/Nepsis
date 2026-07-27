import { useEffect, useState } from 'react'
import {
  dailyCheckInRepository,
  personalBaselineRepository,
  socialCommitmentRepository,
} from '../../data/repositories'
import { enumerateDates } from '../../utils/dateWindows'
import { buildPatternCards, type PatternCardData } from './patternCards'

export function usePatternCards(windowStart: string, windowEnd: string) {
  const [cards, setCards] = useState<PatternCardData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      dailyCheckInRepository.listByDateRange(windowStart, windowEnd),
      socialCommitmentRepository.listByDateRange(windowStart, windowEnd),
      personalBaselineRepository.getSingleton(),
    ]).then(([checkIns, commitments, baseline]) => {
      if (cancelled) return
      setCards(
        buildPatternCards({
          windowStart,
          windowEnd,
          dates: enumerateDates(windowStart, windowEnd),
          checkIns,
          commitments,
          baseline,
        }),
      )
      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [windowStart, windowEnd])

  return { cards, loading }
}
