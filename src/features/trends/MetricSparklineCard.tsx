import { Sparkline } from '../../components/Sparkline'
import { summarizeSeries } from './seriesSummary'
import type { TrendSeries } from './useTrendData'
import { enumerateDates } from '../../utils/dateWindows'
import { formatIsoDateForDisplay } from '../../utils/date'

interface Props {
  series: TrendSeries
  rangeStart: string
  rangeEnd: string
}

/** One metric's sparkline, factual summary, and a data-table equivalent — reused on Home and Trends. */
export function MetricSparklineCard({ series, rangeStart, rangeEnd }: Props) {
  const dates = enumerateDates(rangeStart, rangeEnd)
  const unitSuffix = series.unit ? ` (${series.unit})` : ''

  return (
    <div className="card stack" style={{ gap: 'var(--space-2)' }}>
      <strong>
        {series.label}
        {unitSuffix}
      </strong>
      <Sparkline series={series} rangeStart={rangeStart} rangeEnd={rangeEnd} />
      <p className="hint" style={{ margin: 0 }}>
        {summarizeSeries(series)}
      </p>
      <details>
        <summary>View as a list</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">
                {series.label}
                {unitSuffix}
              </th>
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => {
              const point = series.points.find((p) => p.date === date)
              return (
                <tr key={date}>
                  <th scope="row">{formatIsoDateForDisplay(date)}</th>
                  <td>{point?.value ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </details>
    </div>
  )
}
