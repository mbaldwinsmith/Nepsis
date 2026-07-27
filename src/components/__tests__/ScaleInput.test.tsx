import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScaleInput } from '../ScaleInput'

function Wrapper() {
  return (
    <ScaleInput
      legend="Low mood"
      name="lowMood"
      min={0}
      max={4}
      value={undefined}
      onChange={vi.fn()}
      minLabel="Not at all"
      maxLabel="Severe"
    />
  )
}

describe('ScaleInput', () => {
  it('renders one radio option per scale value with an accessible group label', () => {
    render(<Wrapper />)
    const group = screen.getByRole('radiogroup', { name: 'Low mood' })
    expect(group).toBeInTheDocument()
    for (const n of [0, 1, 2, 3, 4]) {
      expect(screen.getByRole('radio', { name: `Low mood: ${n}` })).toBeInTheDocument()
    }
  })

  it('calls onChange with the selected value when clicked', async () => {
    const onChange = vi.fn()
    render(
      <ScaleInput
        legend="Low mood"
        name="lowMood"
        min={0}
        max={4}
        value={undefined}
        onChange={onChange}
        minLabel="Not at all"
        maxLabel="Severe"
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Low mood: 3' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('is operable with the keyboard', async () => {
    const onChange = vi.fn()
    render(
      <ScaleInput
        legend="Low mood"
        name="lowMood"
        min={0}
        max={4}
        value={0}
        onChange={onChange}
        minLabel="Not at all"
        maxLabel="Severe"
      />,
    )
    const first = screen.getByRole('radio', { name: 'Low mood: 0' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
