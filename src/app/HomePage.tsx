import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  dailyCheckInRepository,
  socialCommitmentRepository,
  transitionEventRepository,
} from '../data/repositories'
import type { DailyCheckIn, SocialCommitment } from '../data/schemas'
import { AlertCard } from '../components/AlertCard'
import { evaluateEnabledRules, type AlertTrigger } from '../rules/alertEngine'
import { PatternCard } from '../features/trends/PatternCard'
import { usePatternCards } from '../features/trends/usePatternCards'
import { addDays, daysBetween } from '../utils/dateWindows'
import { formatIsoDateForDisplay, todayIsoDate } from '../utils/date'

export function HomePage() {
  const today = todayIsoDate()
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | undefined>()
  const [lastNightSleep, setLastNightSleep] = useState<DailyCheckIn | undefined>()
  const [transitionDay, setTransitionDay] = useState<number | undefined>()
  const [upcoming, setUpcoming] = useState<SocialCommitment[]>([])
  const [triggers, setTriggers] = useState<AlertTrigger[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const { cards: patternCards } = usePatternCards(addDays(today, -6), today)

  useEffect(() => {
    Promise.all([
      dailyCheckInRepository.getByDate(today),
      dailyCheckInRepository.listByDateRange(addDays(today, -7), today),
      socialCommitmentRepository.listUpcoming(today),
      evaluateEnabledRules(today),
      transitionEventRepository.listChronological(),
    ]).then(([checkIn, recentCheckIns, commitments, alertTriggers, events]) => {
      setTodayCheckIn(checkIn)

      const withSleep = [...recentCheckIns]
        .reverse()
        .find(
          (c) =>
            c.sleep.sleepDurationMinutes !== undefined ||
            c.sleep.sleepQuality !== undefined,
        )
      setLastNightSleep(
        checkIn?.sleep.sleepDurationMinutes !== undefined ? checkIn : withSleep,
      )

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

      <Link to="/check-in" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        {todayCheckIn
          ? 'Update today’s check-in'
          : 'Start daily check-in — about one minute'}
      </Link>

      {!loading && (
        <>
          {visibleTriggers.length > 0 && (
            <section className="stack">
              <h2 style={{ fontSize: '1rem' }}>Worth reviewing</h2>
              {visibleTriggers.map((trigger) => (
                <AlertCard
                  key={`${trigger.ruleId}-${trigger.dateRangeStart}-${trigger.dateRangeEnd}`}
                  trigger={trigger}
                  onDismiss={() =>
                    setDismissed((prev) =>
                      new Set(prev).add(
                        `${trigger.ruleId}-${trigger.dateRangeStart}-${trigger.dateRangeEnd}`,
                      ),
                    )
                  }
                />
              ))}
            </section>
          )}

          <section className="card">
            <h2 style={{ fontSize: '1rem' }}>Today</h2>
            <p style={{ margin: 0 }}>
              {todayCheckIn
                ? `Check-in recorded, last updated ${new Date(todayCheckIn.updatedAt).toLocaleTimeString()}.`
                : 'No check-in recorded yet today.'}
            </p>
            {lastNightSleep && (
              <p className="hint" style={{ margin: 0 }}>
                Last night's sleep:{' '}
                {[
                  lastNightSleep.sleep.sleepDurationMinutes !== undefined
                    ? `${lastNightSleep.sleep.sleepDurationMinutes} min`
                    : undefined,
                  lastNightSleep.sleep.sleepQuality !== undefined
                    ? `quality ${lastNightSleep.sleep.sleepQuality}/4`
                    : undefined,
                ]
                  .filter(Boolean)
                  .join(', ')}
                {lastNightSleep.entryDate !== today
                  ? ` (recorded ${formatIsoDateForDisplay(lastNightSleep.entryDate)})`
                  : ''}
              </p>
            )}
          </section>

          {patternCards.length > 0 && (
            <section className="stack">
              <h2 style={{ fontSize: '1rem' }}>Recent pattern</h2>
              <PatternCard card={patternCards[0]!} />
              <p style={{ margin: 0 }}>
                <Link to="/trends">See all trends</Link>
              </p>
            </section>
          )}

          <section className="card">
            <h2 style={{ fontSize: '1rem' }}>Upcoming commitments</h2>
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
        Nepsis is not a diagnostic device and does not replace clinical care. Urgent
        concerns should follow your existing clinical or crisis plan — see your{' '}
        <Link to="/safety-plan">safety plan</Link>.
      </p>
    </div>
  )
}
