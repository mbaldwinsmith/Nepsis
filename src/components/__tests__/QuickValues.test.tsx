import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuickValues } from '../QuickValues'

const values = [
  { value: '360', label: '6h' },
  { value: '420', label: '7h' },
  { value: '480', label: '8h' },
]

describe('QuickValues', () => {
  it('renders one button per shortcut value', () => {
    render(
      <QuickValues label="Sleep duration shortcuts" values={values} onSelect={vi.fn()} />,
    )
    expect(
      screen.getByRole('group', { name: 'Sleep duration shortcuts' }),
    ).toBeInTheDocument()
    for (const v of values) {
      expect(screen.getByRole('button', { name: v.label })).toBeInTheDocument()
    }
  })

  it('calls onSelect with the underlying value, not the label, when clicked', async () => {
    const onSelect = vi.fn()
    render(
      <QuickValues
        label="Sleep duration shortcuts"
        values={values}
        onSelect={onSelect}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: '7h' }))
    expect(onSelect).toHaveBeenCalledWith('420')
  })
})
