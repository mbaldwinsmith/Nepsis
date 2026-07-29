import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  transitionEventRepository,
} from '../data/repositories'
import type { DailyCheckIn, SocialCommitment } from '../data/schemas'
import { AlertCard } from '../components/AlertCard'
import { useToast } from '../components/toastContext'
import { evaluateEnabledRules, type AlertTrigger } from '../rules/alertEngine'
import { MetricSparklineCard } from '../features/trends/MetricSparklineCard'
import { useTrendData } from '../features/trends/useTrendData'
import { defaultMetricKeys } from '../features/trends/metrics'
import { addDays, daysBetween } from '../utils/dateWindows'
import { formatIsoDateForDisplay, todayIsoDate } from '../utils/date'

export function HomePage() {
  const today = todayIsoDate()
  const rangeStart = addDays(today, -6)
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | undefined>()
  const [transitionDay, setTransitionDay] = useState<number | undefined>()
  const [upcoming, setUpcoming] = useState<SocialCommitment[]>([])
  const [triggers, setTriggers] = useState<AlertTrigger[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { series: sparklineSeries, loading: sparklineLoading } = useTrendData(
    rangeStart,
    today,
    defaultMetricKeys,
  )
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([
      dailyCheckInRepository.getByDate(today),
      socialCommitmentRepository.listUpcoming(today),
      evaluateEnabledRules(today),
      transitionEventRepository.listChronological(),
    ]).then(([checkIn, commitments, alertTriggers, events]) => {
      setTodayCheckIn(checkIn)

      const transitionStart = events.find((e) => e.type === 'medicationStarted')
      setTransitionDay(
        transitionStart
          ? daysBetween(transitionStart.occurredAt.slice(0, 10), today) + 1
          : undefined,
      )

      setUpcoming(commitments)
      setTriggers(alertTriggers)
      setLoading(false)
    })
  }, [today])

  const visibleTriggers = triggers.filter(
    (t) => !dismissed.has(`${t.ruleId}-${t.dateRangeStart}-${t.dateRangeEnd}`),
  )

  return (
    <div className="page stack">
      <h1>Nepsis</h1>
      <p className="hint">
        Record small facts consistently; interpret patterns collaboratively.
      </p>
      {transitionDay !== undefined && transitionDay > 0 && (
        <p className="hint" style={{ margin: 0 }}>
          Day {transitionDay} of your medication transition.
        </p>
      )}

      <section className="card stack" style={{ borderRadius: 'var(--radius-xl)' }}>
        <Link
          to="/check-in"
          className="btn btn-primary"
          style={{ textDecoration: 'none' }}
        >
          {todayCheckIn
            ? 'Update today’s check-in'
            : 'Start daily check-in — about one minute'}
        </Link>
        <p className="hint" style={{ margin: 0 }}>
          {todayCheckIn
            ? `Check-in recorded, last updated ${new Date(todayCheckIn.updatedAt).toLocaleTimeString()}.`
            : 'No check-in recorded yet today.'}
        </p>
      </section>

      {!loading && (
        <>
          {visibleTriggers.length > 0 && (
            <section className="stack">
              <h2 style={{ fontSize: 'var(--text-title)' }}>Worth reviewing</h2>
              {visibleTriggers.map((trigger) => {
                const triggerKey = `${trigger.ruleId}-${trigger.dateRangeStart}-${trigger.dateRangeEnd}`
                return (
                  <AlertCard
                    key={triggerKey}
                    trigger={trigger}
                    onDismiss={() => {
                      setDismissed((prev) => new Set(prev).add(triggerKey))
                      showToast('Dismissed', 'info', {
                        label: 'Undo',
                        onClick: () =>
                          setDismissed((prev) => {
                            const next = new Set(prev)
                            next.delete(triggerKey)
                            return next
                          }),
                      })
                    }}
                  />
                )
              })}
            </section>
          )}

          <section className="stack">
            <h2 style={{ fontSize: 'var(--text-title)' }}>Last seven days</h2>
            {sparklineLoading ? (
              <p>Loading…</p>
            ) : (
              <div className="stack">
                {sparklineSeries.map((s) => (
                  <MetricSparklineCard
                    key={s.key}
                    series={s}
                    rangeStart={rangeStart}
                    rangeEnd={today}
                  />
                ))}
              </div>
            )}
            <p style={{ margin: 0 }}>
              <Link to="/trends">See all trends</Link>
            </p>
          </section>

          <section className="card">
            <h2 style={{ fontSize: 'var(--text-title)' }}>Upcoming commitments</h2>
            {upcoming.length === 0 ? (
              <p className="hint" style={{ margin: 0 }}>
                Nothing planned yet.
              </p>
            ) : (
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                {upcoming.map((c) => (
                  <li key={c.id}>
                    {formatIsoDateForDisplay(c.plannedDate)} — {c.title || c.type}
                  </li>
                ))}
              </ul>
            )}
            <p style={{ marginTop: 'var(--space-3)', marginBottom: 0 }}>
              <Link to="/commitments">View all commitments</Link>
            </p>
          </section>
        </>
      )}

      <p className="hint">
        Nepsis is not a diagnostic device and does not replace clinical care. A recorded
        pattern can have many explanations — sleep, illness, life events, medication, or
        none of these — and does not by itself mean any one cause. Medication changes
        should only follow the plan agreed with your prescriber. Urgent concerns should
        follow your existing clinical or crisis plan — see your{' '}
        <Link to="/safety-plan">safety plan</Link>.
      </p>
    </div>
  )
}
