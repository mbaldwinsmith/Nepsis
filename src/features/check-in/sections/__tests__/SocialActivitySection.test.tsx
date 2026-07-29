import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SocialActivitySection } from '../SocialActivitySection'
import type { Social } from '../../../../data/schemas'

function Harness() {
  const [social, setSocial] = useState<Social>({})
  return <SocialActivitySection value={social} onChange={setSocial} />
}

describe('SocialActivitySection', () => {
  it('renders a chip for each interaction type', () => {
    render(<Harness />)
    expect(screen.getByRole('checkbox', { name: 'In person' })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: 'Work' })).toBeInTheDocument()
  })

  it('allows selecting more than one interaction type', async () => {
    render(<Harness />)
    await userEvent.click(screen.getByRole('checkbox', { name: 'In person' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Messaging' }))
    expect(screen.getByRole('checkbox', { name: 'In person' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Messaging' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Work' })).not.toBeChecked()
  })
})
