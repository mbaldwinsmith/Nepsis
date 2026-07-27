import { Link } from 'react-router-dom'

const links = [
  {
    to: '/observer',
    label: 'Observer check-in',
    description: 'Record a factual observation as a trusted supporter.',
  },
  {
    to: '/commitments',
    label: 'Plans & commitments',
    description: 'Record plans, attendance, and cancellations.',
  },
  {
    to: '/medication',
    label: 'Medication & timeline',
    description: 'Medication entries and the transition timeline.',
  },
  {
    to: '/health',
    label: 'Health measurements',
    description: 'Weight, and metabolic and liver-function markers.',
  },
  {
    to: '/safety-plan',
    label: 'Safety plan',
    description: 'Contacts, review actions, and agreed instructions.',
  },
  {
    to: '/settings',
    label: 'Settings',
    description: 'Baselines, rules, privacy, export, restore, delete.',
  },
]

export function MorePage() {
  return (
    <div className="page stack">
      <h1>More</h1>
      <div className="stack">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <h2 style={{ fontSize: '1.05rem' }}>{link.label}</h2>
            <p className="hint" style={{ margin: 0, color: 'var(--color-text-muted)' }}>
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
