import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AlertCard } from '../AlertCard'
import type { AlertTrigger } from '../../rules/alertEngine'

const trigger: AlertTrigger = {
  ruleId: 'default-reduced-sleep-plus-activation',
  ruleLabel: 'Reduced sleep plus activation',
  ruleVersion: 1,
  severity: 'review',
  dateRangeStart: '2026-01-08',
  dateRangeEnd: '2026-01-14',
  summary: 'Sleep was reduced with signs of activation for 2 consecutive nights.',
  evidence: [
    {
      date: '2026-01-08',
      source: 'self-report',
      description: 'Sleep 300 min (usual 440 min)',
    },
    {
      date: '2026-01-09',
      source: 'self-report',
      description: 'Sleep 310 min (usual 440 min)',
    },
  ],
  actionText: 'This pattern may be worth reviewing with someone from your support plan.',
}

function renderCard(t = trigger, onDismiss = vi.fn()) {
  return render(
    <MemoryRouter>
      <AlertCard trigger={t} onDismiss={onDismiss} />
    </MemoryRouter>,
  )
}

describe('AlertCard', () => {
  it('shows the rule label, severity, summary, action text, and a safety-plan link', () => {
    renderCard()
    expect(screen.getByText('Reduced sleep plus activation')).toBeInTheDocument()
    expect(screen.getByText('Review')).toBeInTheDocument()
    expect(screen.getByText(trigger.summary)).toBeInTheDocument()
    expect(screen.getByText(trigger.actionText)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'View safety plan' })).toHaveAttribute(
      'href',
      '/safety-plan',
    )
  })

  it('reveals every piece of evidence that triggered it', () => {
    renderCard()
    expect(screen.getByText(/What triggered this \(2\)/)).toBeInTheDocument()
    expect(screen.getByText(/Sleep 300 min \(usual 440 min\)/)).toBeInTheDocument()
    expect(screen.getByText(/Sleep 310 min \(usual 440 min\)/)).toBeInTheDocument()
  })

  it('calls onDismiss when the Dismiss control is used', async () => {
    const onDismiss = vi.fn()
    renderCard(trigger, onDismiss)
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('shows an "Act" badge for act-severity triggers', () => {
    renderCard({ ...trigger, severity: 'act' })
    expect(screen.getByText('Act')).toBeInTheDocument()
  })
})
