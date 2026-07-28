import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObserverForm } from '../ObserverForm'

describe('ObserverForm', () => {
  it('does not submit without an observer label', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(<ObserverForm onCreate={onCreate} />)

    await userEvent.click(screen.getByRole('button', { name: 'Save observation' }))

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('submits the filled-in observation with the selected concern level', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    render(<ObserverForm onCreate={onCreate} />)

    await userEvent.type(
      screen.getByLabelText('Your label (e.g. Mum, Dad, Friend A)'),
      'Friend A',
    )
    await userEvent.click(screen.getByRole('radio', { name: 'Discuss soon' }))
    await userEvent.click(screen.getByRole('button', { name: 'Save observation' }))

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({ observerLabel: 'Friend A', concern: 'discussSoon' }),
    )
  })
})
