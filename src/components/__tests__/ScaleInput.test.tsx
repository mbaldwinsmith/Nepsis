import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ScaleInput } from '../ScaleInput'
import { NOT_AT_ALL_TO_SEVERE } from '../../utils/scaleWords'

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
      words={NOT_AT_ALL_TO_SEVERE}
    />
  )
}

describe('ScaleInput', () => {
  it('renders one radio option per scale value with an accessible group label', () => {
    render(<Wrapper />)
    const group = screen.getByRole('radiogroup', { name: 'Low mood' })
    expect(group).toBeInTheDocument()
    for (const word of NOT_AT_ALL_TO_SEVERE) {
      expect(screen.getByRole('radio', { name: `Low mood: ${word}` })).toBeInTheDocument()
    }
  })

  it('shows a "not yet" status next to the legend when no value is set', () => {
    render(<Wrapper />)
    expect(screen.getByText('not yet')).toBeInTheDocument()
  })

  it('does not show a "not yet" status once a value is set', () => {
    render(
      <ScaleInput
        legend="Low mood"
        name="lowMood"
        min={0}
        max={4}
        value={2}
        onChange={vi.fn()}
        minLabel="Not at all"
        maxLabel="Severe"
        words={NOT_AT_ALL_TO_SEVERE}
      />,
    )
    expect(screen.queryByText('not yet')).not.toBeInTheDocument()
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
        words={NOT_AT_ALL_TO_SEVERE}
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Low mood: marked' }))
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
        words={NOT_AT_ALL_TO_SEVERE}
      />,
    )
    const first = screen.getByRole('radio', { name: 'Low mood: not at all' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
