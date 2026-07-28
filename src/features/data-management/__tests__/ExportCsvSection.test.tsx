import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from '../../../components/ToastProvider'
import { ExportCsvSection } from '../ExportCsvSection'
import { EXPORT_CATEGORY_LABELS } from '../csvExport'

const ALL_LABELS = Object.values(EXPORT_CATEGORY_LABELS)

describe('ExportCsvSection', () => {
  it('has every category, notes, and observer-label toggle checked by default', () => {
    render(<ExportCsvSection />, { wrapper: ToastProvider })
    for (const label of ALL_LABELS) {
      expect(screen.getByLabelText(label)).toBeChecked()
    }
    expect(screen.getByLabelText('Include free-text notes')).toBeChecked()
    expect(screen.getByLabelText('Include observer labels')).toBeChecked()
  })

  it('lets a category be unchecked', async () => {
    render(<ExportCsvSection />, { wrapper: ToastProvider })
    const checkbox = screen.getByLabelText(EXPORT_CATEGORY_LABELS.dailyCheckIns)
    await userEvent.click(checkbox)
    expect(checkbox).not.toBeChecked()
  })

  it('shows an error and does not attempt an export when no category is selected', async () => {
    render(<ExportCsvSection />, { wrapper: ToastProvider })
    for (const label of ALL_LABELS) {
      await userEvent.click(screen.getByLabelText(label))
    }
    await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }))

    expect(
      await screen.findByText('Choose at least one category to export'),
    ).toBeInTheDocument()
  })
})
