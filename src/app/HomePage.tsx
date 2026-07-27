import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { dailyCheckInRepository, socialCommitmentRepository } from '../data/repositories'
import type { DailyCheckIn, SocialCommitment } from '../data/schemas'
import { formatIsoDateForDisplay, todayIsoDate } from '../utils/date'

export function HomePage() {
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | undefined>()
  const [upcoming, setUpcoming] = useState<SocialCommitment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const today = todayIsoDate()
    Promise.all([
      dailyCheckInRepository.getByDate(today),
      socialCommitmentRepository.listUpcoming(today),
    ]).then(([checkIn, commitments]) => {
      setTodayCheckIn(checkIn)
      setUpcoming(commitments)
      setLoading(false)
    })
  }, [])

  return (
    <div className="page stack">
      <h1>Nepsis</h1>
      <p className="hint">
        Record small facts consistently; interpret patterns collaboratively.
      </p>

      <Link to="/check-in" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        {todayCheckIn
          ? 'Update today’s check-in'
          : 'Start daily check-in — about one minute'}
      </Link>

      {!loading && (
        <>
          <section className="card">
            <h2 style={{ fontSize: '1rem' }}>Today</h2>
            <p style={{ margin: 0 }}>
              {todayCheckIn
                ? `Check-in recorded, last updated ${new Date(todayCheckIn.updatedAt).toLocaleTimeString()}.`
                : 'No check-in recorded yet today.'}
            </p>
          </section>

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
