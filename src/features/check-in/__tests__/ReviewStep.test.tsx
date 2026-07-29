import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReviewStep } from '../ReviewStep'
import { checkInSteps } from '../steps'
import type { CheckInDraft } from '../useDailyCheckIn'

function draft(overrides: Partial<CheckInDraft> = {}): CheckInDraft {
  return {
    sleep: {},
    mood: {},
    warningSigns: {},
    medicationEffects: {},
    appetite: {},
    urges: {},
    alcohol: {},
    social: {},
    notes: '',
    ...overrides,
  }
}

describe('ReviewStep', () => {
  it('renders one card per step, with a title for each', () => {
    render(<ReviewStep draft={draft()} onEditStep={vi.fn()} />)
    for (const step of checkInSteps) {
      expect(screen.getByText(step.title)).toBeInTheDocument()
    }
  })

  it('shows "Not recorded" for a step with nothing filled in', () => {
    render(<ReviewStep draft={draft()} onEditStep={vi.fn()} />)
    expect(screen.getAllByText('Not recorded').length).toBeGreaterThan(0)
  })

  it('shows recorded values with their labels', () => {
    render(
      <ReviewStep
        draft={draft({ sleep: { sleepDurationMinutes: 420, sleepQuality: 3 } })}
        onEditStep={vi.fn()}
      />,
    )
    expect(screen.getByText('Sleep duration')).toBeInTheDocument()
    expect(screen.getByText('420 min')).toBeInTheDocument()
    expect(screen.getByText('Sleep quality')).toBeInTheDocument()
    expect(screen.getByText('good')).toBeInTheDocument()
  })

  it('shows the note text as plain text rather than a label/value row', () => {
    render(<ReviewStep draft={draft({ notes: 'Felt tired' })} onEditStep={vi.fn()} />)
    expect(screen.getByText('Felt tired')).toBeInTheDocument()
  })

  it('calls onEditStep with the step index when its Edit button is clicked', async () => {
    const onEditStep = vi.fn()
    render(<ReviewStep draft={draft()} onEditStep={onEditStep} />)
    const moodPaceIndex = checkInSteps.findIndex((s) => s.id === 'mood-pace')
    await userEvent.click(screen.getAllByRole('button', { name: 'Edit' })[moodPaceIndex]!)
    expect(onEditStep).toHaveBeenCalledWith(moodPaceIndex)
  })
})
