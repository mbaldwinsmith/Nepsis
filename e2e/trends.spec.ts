import { test, expect } from '@playwright/test'

test('trends page shows the default metric trio, pattern cards, and enforces the 3-metric limit', async ({
  page,
}) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()

  await page.goto('/trends')
  await expect(page.getByRole('img', { name: /Trend chart for/ })).toBeVisible()
  await expect(page.getByText('View data as a table')).toBeVisible()

  const legend = page.locator('.stack > div > span')
  await expect(legend).toContainText(['Sleep duration (min)', 'Energy', 'Appetite'])

  // A 4th metric should be blocked while 3 are already selected.
  await expect(page.getByRole('checkbox', { name: 'Weight' })).toBeDisabled()

  // Switch to a 30-day window, wide enough to reliably contain the seed
  // data's cancellations regardless of the real current date. The radios
  // are visually hidden in favour of their styled <label>, so click the
  // visible label text rather than the input.
  await page
    .getByRole('radiogroup', { name: 'Date range' })
    .getByText('Last 30 days', { exact: true })
    .click()
  await expect(page.getByText(/View data as a table/)).toBeVisible()

  const cancellationCard = page.getByText(/You cancelled \d+ meaningful commitment/)
  await expect(cancellationCard).toBeVisible()
  await cancellationCard.click()
  await expect(page).toHaveURL(/\/commitments$/)
})

test('trends chart is usable at 320px width without horizontal scroll', async ({
  page,
}) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()

  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/trends')
  await expect(page.getByRole('img', { name: /Trend chart for/ })).toBeVisible()

  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
})
