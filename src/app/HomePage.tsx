import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  transitionEventRepository,
} from '../data/repositories'
import type { DailyCheckIn, SocialCommitment } from '../data/schemas'
import { AlertCard } from '../components/AlertCard'
import { AddDisclosure } from '../components/AddDisclosure'
import { TextField } from '../components/TextField'
import { useToast } from '../components/toastContext'
import { evaluateEnabledRules, type AlertTrigger } from '../rules/alertEngine'
import { MetricSparklineCard } from '../features/trends/MetricSparklineCard'
import { useTrendData } from '../features/trends/useTrendData'
import { defaultMetricKeys } from '../features/trends/metrics'
import { addDays, daysBetween, enumerateDates } from '../utils/dateWindows'
import { formatIsoDateForDisplay, todayIsoDate } from '../utils/date'

function PastCheckInPicker({ today }: { today: string }) {
  const [date, setDate] = useState('')
  const navigate = useNavigate()

  return (
    <AddDisclosure label="+ Fill in an earlier day">
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault()
          if (date) navigate(`/check-in/${date}`)
        }}
      >
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={setDate}
          max={today}
          required
        />
        <button type="submit" className="btn btn-primary">
          Go
        </button>
      </form>
    </AddDisclosure>
  )
}

export function HomePage() {
  const today = todayIsoDate()
  const rangeStart = addDays(today, -6)
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([])
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
      dailyCheckInRepository.listByDateRange(rangeStart, today),
      socialCommitmentRepository.listUpcoming(today),
      evaluateEnabledRules(today),
      transitionEventRepository.listChronological(),
    ]).then(([entries, commitments, alertTriggers, events]) => {
      setCheckIns(entries)

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
  }, [today, rangeStart])

  const todayCheckIn = checkIns.find((c) => c.entryDate === today)
  const recordedDates = new Set(checkIns.map((c) => c.entryDate))
  const priorDates = enumerateDates(rangeStart, addDays(today, -1)).reverse()

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

      <section className="card stack">
        <h2 style={{ fontSize: 'var(--text-title)' }}>Recent check-ins</h2>
        <p className="hint" style={{ margin: 0 }}>
          Missed a day? You can go back and fill it in.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          {priorDates.map((d) => (
            <li key={d}>
              {formatIsoDateForDisplay(d)} —{' '}
              {recordedDates.has(d) ? 'recorded' : 'not recorded'}{' '}
              <Link to={`/check-in/${d}`}>
                {recordedDates.has(d) ? 'Edit' : 'Fill in'}
              </Link>
            </li>
          ))}
        </ul>
        <PastCheckInPicker today={today} />
      </section>

      {!loading && (
        <>
          {visibleTriggers.length > 0 && (
            <section className="stack">
              <h2 style={{ fontSize: 'var(--text-title)' }}>
                Worth a look, when you have a moment
              </h2>
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
