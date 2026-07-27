import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/check-in', label: 'Check in', icon: '✓' },
  { to: '/trends', label: 'Trends', icon: '~' },
  { to: '/more', label: 'More', icon: '···' },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-height)',
        display: 'flex',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
            fontWeight: isActive ? 700 : 500,
            fontSize: '0.75rem',
          })}
        >
          <span aria-hidden="true" style={{ fontSize: '1.25rem' }}>
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
