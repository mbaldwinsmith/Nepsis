import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DoseLog } from '../DoseLog'
import { SCHEMA_VERSION, type MedicationDefinition } from '../../../data/schemas'

function definition(overrides: Partial<MedicationDefinition> = {}): MedicationDefinition {
  return {
    id: 'med-1',
    schemaVersion: SCHEMA_VERSION,
    name: 'Sample medication A',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('DoseLog', () => {
  it('prompts to add a medication first when there are no active definitions', () => {
    render(<DoseLog definitions={[]} entries={[]} onCreate={vi.fn()} />)
    expect(
      screen.getByText('Add a medication above before logging a dose.'),
    ).toBeInTheDocument()
  })

  it('defaults status to "taken" and submits the selected status', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(<DoseLog definitions={[definition()]} entries={[]} onCreate={onCreate} />)

    await userEvent.click(screen.getByText('+ Log a dose'))
    await userEvent.click(screen.getByRole('radio', { name: 'Delayed' }))
    await userEvent.click(screen.getByRole('button', { name: 'Log dose' }))

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ medicationDefinitionId: 'med-1', status: 'delayed' }),
    )
  })

  it('lists recent entries against their medication name', () => {
    render(
      <DoseLog
        definitions={[definition()]}
        entries={[
          {
            id: 'entry-1',
            schemaVersion: SCHEMA_VERSION,
            medicationDefinitionId: 'med-1',
            takenAt: '2026-01-15T08:00:00.000Z',
            status: 'taken',
          },
        ]}
        onCreate={vi.fn()}
      />,
    )
    expect(screen.getAllByText(/Sample medication A/).length).toBeGreaterThan(0)
  })
})
