import { useState } from 'react'
import { TrendChart } from '../../components/TrendChart'
import { addDays } from '../../utils/dateWindows'
import { todayIsoDate } from '../../utils/date'
import { RangeSelector, type RangePreset } from './RangeSelector'
import { MetricPicker } from './MetricPicker'
import { PatternCard } from './PatternCard'
import { defaultMetricKeys, type MetricKey } from './metrics'
import { useTrendData } from './useTrendData'
import { usePatternCards } from './usePatternCards'

function rangeFor(preset: RangePreset, customStart: string, customEnd: string) {
  const today = todayIsoDate()
  if (preset === '7') return { start: addDays(today, -6), end: today }
  if (preset === '30') return { start: addDays(today, -29), end: today }
  return customEnd < customStart
    ? { start: customEnd, end: customStart }
    : { start: customStart, end: customEnd }
}

export function TrendsPage() {
  const today = todayIsoDate()
  const [preset, setPreset] = useState<RangePreset>('7')
  const [customStart, setCustomStart] = useState(addDays(today, -6))
  const [customEnd, setCustomEnd] = useState(today)
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(defaultMetricKeys)

  const { start: rangeStart, end: rangeEnd } = rangeFor(preset, customStart, customEnd)
  const {
    series,
    events,
    loading: chartLoading,
  } = useTrendData(rangeStart, rangeEnd, selectedMetrics)
  const { cards, loading: cardsLoading } = usePatternCards(rangeStart, rangeEnd)

  return (
    <div className="page stack">
      <h1>Trends</h1>
      <p className="hint">
        Facts and dates, not diagnoses or causal claims. Every chart has a data table
        underneath for a non-visual equivalent.
      </p>

      <section className="card stack">
        <RangeSelector
          preset={preset}
          customStart={customStart}
          customEnd={customEnd}
          onPresetChange={setPreset}
          onCustomStartChange={setCustomStart}
          onCustomEndChange={setCustomEnd}
        />
        <MetricPicker selected={selectedMetrics} onChange={setSelectedMetrics} />
      </section>

      <section className="card">
        {chartLoading ? (
          <p>Loading…</p>
        ) : (
          <TrendChart
            series={series}
            events={events}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />
        )}
      </section>

      <section className="stack">
        <h2 style={{ fontSize: '1rem' }}>Recent patterns</h2>
        {cardsLoading ? (
          <p>Loading…</p>
        ) : cards.length === 0 ? (
          <p className="hint">No notable patterns in the selected period yet.</p>
        ) : (
          cards.map((card) => <PatternCard key={card.id} card={card} />)
        )}
      </section>
    </div>
  )
}
