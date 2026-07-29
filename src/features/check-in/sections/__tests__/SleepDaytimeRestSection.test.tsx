import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SleepDaytimeRestSection } from '../SleepDaytimeRestSection'
import type { Sleep } from '../../../../data/schemas'

function Harness({ initial = {} }: { initial?: Sleep }) {
  const [value, setValue] = useState<Sleep>(initial)
  return <SleepDaytimeRestSection value={value} onChange={setValue} />
}

describe('SleepDaytimeRestSection', () => {
  it('hides nap duration and after-effect fields until a nap is marked as taken', () => {
    render(<Harness />)
    expect(screen.queryByLabelText('Nap duration (minutes)')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('radiogroup', { name: 'Nap after-effect' }),
    ).not.toBeInTheDocument()
  })

  it('reveals nap fields once "Nap taken" is switched on', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('switch', { name: 'Nap taken' }))
    expect(screen.getByLabelText('Nap duration (minutes)')).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Nap after-effect' }),
    ).toBeInTheDocument()
  })

  it('clears nap duration and after-effect when "Nap taken" is switched off again', async () => {
    render(
      <Harness
        initial={{ napTaken: true, napDurationMinutes: 30, napEffect: 'refreshed' }}
      />,
    )
    expect(screen.getByLabelText('Nap duration (minutes)')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('switch', { name: 'Nap taken' }))

    expect(screen.queryByLabelText('Nap duration (minutes)')).not.toBeInTheDocument()
  })
})
