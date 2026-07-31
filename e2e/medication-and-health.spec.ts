import { test, expect } from '@playwright/test'

test('adds a medication, logs a dose, and records a dose-change transition event', async ({
  page,
}) => {
  await page.goto('/#/medication')

  await page.getByText('+ Add a medication').click()
  await page.getByLabel('Medication name').fill('Sample medication A')
  await page.getByRole('button', { name: 'Add medication' }).click()
  await expect(
    page.getByRole('listitem').filter({ hasText: 'Sample medication A' }),
  ).toBeVisible()
  await expect(page.getByText('Medication added')).toBeVisible()

  await page.getByText('+ Log a dose').click()
  await page
    .getByRole('radiogroup', { name: 'Status' })
    .getByText('Taken', { exact: true })
    .click()
  await page.getByRole('button', { name: 'Log dose' }).click()
  await expect(
    page.locator('li.hint').filter({ hasText: 'Sample medication A' }),
  ).toBeVisible()
  await expect(page.getByText('Dose logged')).toBeVisible()

  await page.getByText('+ Add an event').click()
  await page
    .getByRole('radiogroup', { name: 'Event type' })
    .getByText('Dose increased', { exact: true })
    .click()
  await page.getByLabel('Title').fill('Dose increased to 10mg (agreed with prescriber)')
  await page.getByRole('button', { name: 'Add event' }).click()
  await expect(
    page.getByText('Dose increased to 10mg (agreed with prescriber)'),
  ).toBeVisible()
  await expect(page.getByText('Event added')).toBeVisible()
})

test('archiving a medication can be undone', async ({ page }) => {
  await page.goto('/#/medication')

  await page.getByText('+ Add a medication').click()
  await page.getByLabel('Medication name').fill('Sample medication B')
  await page.getByRole('button', { name: 'Add medication' }).click()
  const item = page.getByRole('listitem').filter({ hasText: 'Sample medication B' })
  await expect(item).toBeVisible()

  await item.getByRole('button', { name: 'Archive' }).click()
  await expect(item).toContainText('archived')
  await expect(page.getByText('Sample medication B archived')).toBeVisible()

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(item).not.toContainText('archived')
  await expect(item.getByRole('button', { name: 'Archive' })).toBeVisible()
})

test('records a weight measurement and a liver-function result', async ({ page }) => {
  await page.goto('/#/health')

  await page.getByText('+ Add a measurement').click()
  await page.getByLabel('Value').fill('78.2')
  await page.getByRole('button', { name: 'Save measurement' }).click()
  await expect(page.getByText('78.2 kg')).toBeVisible()
  await expect(page.getByText('Measurement recorded')).toBeVisible()

  await page.getByLabel('Type').selectOption('alt')
  await page.getByLabel('Value').fill('28')
  await page.getByLabel('Reference minimum (optional)').fill('7')
  await page.getByLabel('Reference maximum (optional)').fill('55')
  await page.getByRole('button', { name: 'Save measurement' }).click()
  await expect(page.getByText('28 U/L')).toBeVisible()
  // .last() since the first save's toast may still be visible/stacked.
  await expect(page.getByText('Measurement recorded').last()).toBeVisible()
})
