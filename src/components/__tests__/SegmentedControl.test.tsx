import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SegmentedControl } from '../SegmentedControl'

const options = [
  { value: 'social', label: 'Social' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
]

describe('SegmentedControl', () => {
  it('renders one radio option per option with an accessible group label', () => {
    render(
      <SegmentedControl
        legend="Context"
        name="context"
        options={options}
        value={undefined}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('radiogroup', { name: 'Context' })).toBeInTheDocument()
    for (const option of options) {
      expect(screen.getByRole('radio', { name: option.label })).toBeInTheDocument()
    }
  })

  it('reflects the currently selected value', () => {
    render(
      <SegmentedControl
        legend="Context"
        name="context"
        options={options}
        value="work"
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('radio', { name: 'Work' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Social' })).not.toBeChecked()
  })

  it('calls onChange with the selected value when clicked', async () => {
    const onChange = vi.fn()
    render(
      <SegmentedControl
        legend="Context"
        name="context"
        options={options}
        value={undefined}
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Other' }))
    expect(onChange).toHaveBeenCalledWith('other')
  })

  it('is operable with the keyboard', async () => {
    const onChange = vi.fn()
    render(
      <SegmentedControl
        legend="Context"
        name="context"
        options={options}
        value="social"
        onChange={onChange}
      />,
    )
    const first = screen.getByRole('radio', { name: 'Social' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('work')
  })

  it('renders the hint text when provided', () => {
    render(
      <SegmentedControl
        legend="Context"
        name="context"
        options={options}
        value={undefined}
        onChange={vi.fn()}
        hint="Choose the closest match."
      />,
    )
    expect(screen.getByText('Choose the closest match.')).toBeInTheDocument()
  })
})
