import { NavLink } from 'react-router-dom'

const primaryItems = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/check-in', label: 'Check in', icon: '✓' },
  { to: '/trends', label: 'Trends', icon: '~' },
  { to: '/more', label: 'More', icon: '···' },
]

const secondaryItems = [
  { to: '/commitments', label: 'Plans & commitments' },
  { to: '/medication', label: 'Medication & timeline' },
  { to: '/health', label: 'Health measurements' },
  { to: '/settings', label: 'Settings' },
]

function linkClassName({ isActive }: { isActive: boolean }): string {
  return `left-rail__link${isActive ? ' left-rail__link--active' : ''}`
}

/** A desktop-width sidebar shown instead of BottomNav at >=900px (see global.css). */
export function LeftRail() {
  return (
    <nav aria-label="Primary" className="left-rail">
      <p className="left-rail__brand">Nepsis</p>
      <ul className="left-rail__list">
        {primaryItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.to === '/'} className={linkClassName}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <hr className="left-rail__divider" />
      <ul className="left-rail__list">
        {secondaryItems.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} className={linkClassName}>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
