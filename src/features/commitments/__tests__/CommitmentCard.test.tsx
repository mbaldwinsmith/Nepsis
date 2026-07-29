import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommitmentCard } from '../CommitmentCard'
import { SCHEMA_VERSION, type SocialCommitment } from '../../../data/schemas'

function baseCommitment(overrides: Partial<SocialCommitment> = {}): SocialCommitment {
  return {
    id: 'commitment-1',
    schemaVersion: SCHEMA_VERSION,
    plannedDate: '2026-01-15',
    type: 'friends',
    importance: 'routine',
    outcome: 'planned',
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
    ...overrides,
  }
}

function Harness({ initial }: { initial: SocialCommitment }) {
  const [commitment, setCommitment] = useState(initial)
  return <CommitmentCard commitment={commitment} onUpdate={setCommitment} />
}

describe('CommitmentCard', () => {
  it('hides reason, notice, and after-effect fields for a planned or attended commitment', () => {
    render(<Harness initial={baseCommitment({ outcome: 'attended' })} />)
    expect(
      screen.queryByRole('radiogroup', { name: 'Notice given' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Reason (select any that apply)')).not.toBeInTheDocument()
  })

  it('reveals reason, notice, and after-effect fields once "Cancelled" is selected', async () => {
    render(<Harness initial={baseCommitment({ outcome: 'attended' })} />)
    await userEvent.click(screen.getByRole('radio', { name: 'Cancelled' }))
    expect(screen.getByText('Reason (select any that apply)')).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Notice given' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'After-effect' })).toBeInTheDocument()
  })

  it('clears detail fields when switching back to "Attended"', async () => {
    render(
      <Harness
        initial={baseCommitment({ outcome: 'cancelled', reasons: ['distress'] })}
      />,
    )
    expect(screen.getByText('Reason (select any that apply)')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('radio', { name: 'Attended' }))

    expect(screen.queryByText('Reason (select any that apply)')).not.toBeInTheDocument()
  })
})
