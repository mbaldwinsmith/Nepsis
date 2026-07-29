import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChipMultiSelect } from '../ChipMultiSelect'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('ChipMultiSelect', () => {
  it('renders one checkbox per option with an accessible group label', () => {
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={[]}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('group', { name: 'Pick some' })).toBeInTheDocument()
    for (const option of options) {
      expect(screen.getByRole('checkbox', { name: option.label })).toBeInTheDocument()
    }
  })

  it('reflects which values are already selected', () => {
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={['b']}
        onChange={vi.fn()}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'Option B' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Option A' })).not.toBeChecked()
  })

  it('adds a value to the selection when an unchecked chip is clicked', async () => {
    const onChange = vi.fn()
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={['a']}
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'Option C' }))
    expect(onChange).toHaveBeenCalledWith(['a', 'c'])
  })

  it('removes a value from the selection when a checked chip is clicked', async () => {
    const onChange = vi.fn()
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={['a', 'b']}
        onChange={onChange}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'Option A' }))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })

  it('disables unselected options once isOptionDisabled reports a cap is reached', async () => {
    const onChange = vi.fn()
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={['a', 'b']}
        onChange={onChange}
        isOptionDisabled={(value) => value !== 'a' && value !== 'b'}
      />,
    )
    expect(screen.getByRole('checkbox', { name: 'Option C' })).toBeDisabled()
    expect(screen.getByRole('checkbox', { name: 'Option A' })).not.toBeDisabled()
  })

  it('still allows unchecking an already-selected option while at the cap', async () => {
    const onChange = vi.fn()
    render(
      <ChipMultiSelect
        legend="Pick some"
        name="picks"
        options={options}
        values={['a', 'b']}
        onChange={onChange}
        isOptionDisabled={(value) => value !== 'a' && value !== 'b'}
      />,
    )
    await userEvent.click(screen.getByRole('checkbox', { name: 'Option A' }))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })
})
