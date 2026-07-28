import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from '../../../components/ToastProvider'
import { DeleteAllData } from '../DeleteAllData'

describe('DeleteAllData', () => {
  it('requires a second confirming click before deleting anything', async () => {
    render(<DeleteAllData />, { wrapper: ToastProvider })

    expect(
      screen.queryByText('Are you sure? This cannot be undone.'),
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Delete all local data' }))

    expect(screen.getByText('Are you sure? This cannot be undone.')).toBeInTheDocument()
  })

  it('returns to the initial state without deleting anything when cancelled', async () => {
    render(<DeleteAllData />, { wrapper: ToastProvider })

    await userEvent.click(screen.getByRole('button', { name: 'Delete all local data' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(
      screen.queryByText('Are you sure? This cannot be undone.'),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Delete all local data' }),
    ).toBeInTheDocument()
  })

  it('deletes all local data and confirms via toast once the user confirms', async () => {
    render(<DeleteAllData />, { wrapper: ToastProvider })

    await userEvent.click(screen.getByRole('button', { name: 'Delete all local data' }))
    await userEvent.click(screen.getByRole('button', { name: 'Yes, delete everything' }))

    expect(await screen.findByText('All local data deleted')).toBeInTheDocument()
  })
})
