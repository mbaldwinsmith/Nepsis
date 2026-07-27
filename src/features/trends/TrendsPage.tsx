import { Link } from 'react-router-dom'

export function TrendsPage() {
  return (
    <div className="page stack">
      <h1>Trends</h1>
      <p>
        Trend charts and the transparent review-rule engine are planned but not yet built.
        Your recorded observations are already saved and can be reviewed directly:
      </p>
      <ul>
        <li>
          <Link to="/check-in">Daily check-ins</Link>
        </li>
        <li>
          <Link to="/commitments">Commitments and cancellations</Link>
        </li>
        <li>
          <Link to="/observer">Observer entries</Link>
        </li>
        <li>
          <Link to="/medication">Medication and transition timeline</Link>
        </li>
        <li>
          <Link to="/health">Health measurements</Link>
        </li>
      </ul>
      <p className="hint">
        When trends are added, they will show facts and dates rather than diagnoses or
        causal claims.
      </p>
    </div>
  )
}
