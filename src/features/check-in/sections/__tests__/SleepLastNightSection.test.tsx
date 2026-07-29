import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SleepLastNightSection } from '../SleepLastNightSection'
import type { Sleep } from '../../../../data/schemas'

function Harness() {
  const [value, setValue] = useState<Sleep>({})
  return <SleepLastNightSection value={value} onChange={setValue} />
}

describe('SleepLastNightSection', () => {
  it('fills sleep duration from a quick-value shortcut', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: '7h' }))
    expect(screen.getByLabelText('Sleep duration (minutes)')).toHaveValue(420)
  })
})
