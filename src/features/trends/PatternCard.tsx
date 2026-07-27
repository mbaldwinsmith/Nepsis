import { Link } from 'react-router-dom'
import type { PatternCardData } from './patternCards'

export function PatternCard({ card }: { card: PatternCardData }) {
  return (
    <Link
      to={card.linkTo}
      className="card"
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <p style={{ margin: 0 }}>{card.text}</p>
    </Link>
  )
}
