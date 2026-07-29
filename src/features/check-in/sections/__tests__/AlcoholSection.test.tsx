import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlcoholSection } from '../AlcoholSection'
import type { Alcohol } from '../../../../data/schemas'

function Harness({ initial = {} }: { initial?: Alcohol }) {
  const [alcohol, setAlcohol] = useState<Alcohol>(initial)
  return <AlcoholSection value={alcohol} onChange={setAlcohol} />
}

describe('AlcoholSection', () => {
  it('hides context and perceived-effect controls when no units are recorded', () => {
    render(<Harness />)
    expect(screen.queryByRole('radiogroup', { name: 'Context' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('radiogroup', { name: 'Perceived effect' }),
    ).not.toBeInTheDocument()
  })

  it('reveals context and perceived-effect controls once units consumed is greater than zero', async () => {
    render(<Harness />)
    await userEvent.type(screen.getByLabelText('Units consumed'), '2')
    expect(screen.getByRole('radiogroup', { name: 'Context' })).toBeInTheDocument()
    expect(
      screen.getByRole('radiogroup', { name: 'Perceived effect' }),
    ).toBeInTheDocument()
  })

  it('hides context and perceived-effect controls again once units drop back to zero', async () => {
    render(<Harness initial={{ unitsConsumed: 2, context: 'social' }} />)
    expect(screen.getByRole('radiogroup', { name: 'Context' })).toBeInTheDocument()

    await userEvent.clear(screen.getByLabelText('Units consumed'))
    await userEvent.type(screen.getByLabelText('Units consumed'), '0')

    expect(screen.queryByRole('radiogroup', { name: 'Context' })).not.toBeInTheDocument()
  })
})
