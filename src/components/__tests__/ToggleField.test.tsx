import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToggleField } from '../ToggleField'

describe('ToggleField', () => {
  it('renders as an accessible switch reflecting the checked state', () => {
    render(<ToggleField label="Nap taken" checked={false} onChange={vi.fn()} />)
    const toggle = screen.getByRole('switch', { name: 'Nap taken' })
    expect(toggle).not.toBeChecked()
  })

  it('shows the switch as checked when the value is true', () => {
    render(<ToggleField label="Nap taken" checked={true} onChange={vi.fn()} />)
    expect(screen.getByRole('switch', { name: 'Nap taken' })).toBeChecked()
  })

  it('calls onChange with the new value when toggled', async () => {
    const onChange = vi.fn()
    render(<ToggleField label="Nap taken" checked={false} onChange={onChange} />)
    await userEvent.click(screen.getByRole('switch', { name: 'Nap taken' }))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('renders the hint text when provided', () => {
    render(
      <ToggleField
        label="Nap taken"
        checked={false}
        onChange={vi.fn()}
        hint="Any daytime sleep counts."
      />,
    )
    expect(screen.getByText('Any daytime sleep counts.')).toBeInTheDocument()
  })

  it('disables the switch when disabled is true', () => {
    render(<ToggleField label="Nap taken" checked={false} onChange={vi.fn()} disabled />)
    expect(screen.getByRole('switch', { name: 'Nap taken' })).toBeDisabled()
  })
})
