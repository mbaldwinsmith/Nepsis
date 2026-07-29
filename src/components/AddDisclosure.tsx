import type { ReactNode } from 'react'

interface AddDisclosureProps {
  label: string
  className?: string
  children: ReactNode
}

/** Hides a rarely-used add-form behind a "+ Add..." summary, e.g. on Home, Health, and Medication. */
export function AddDisclosure({ label, className, children }: AddDisclosureProps) {
  return (
    <details className={['add-disclosure', className].filter(Boolean).join(' ')}>
      <summary>{label}</summary>
      <div className="add-disclosure__content stack">{children}</div>
    </details>
  )
}
