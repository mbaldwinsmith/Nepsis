import { test, expect } from '@playwright/test'
import { todayIsoDate, formatIsoDateForDisplay } from '../src/utils/date'
import { addDays } from '../src/utils/dateWindows'

const today = todayIsoDate()
const yesterday = addDays(today, -1)

test('Home lists recent days and lets you fill in a past one from the list', async ({
  page,
}) => {
  await page.goto('/#/')
  const recentCard = page.locator('.card').filter({ hasText: 'Recent check-ins' })
  const yesterdayRow = recentCard.locator('li', {
    hasText: formatIsoDateForDisplay(yesterday),
  })
  await expect(yesterdayRow).toContainText('not recorded')

  await yesterdayRow.getByRole('link', { name: 'Fill in' }).click()

  await expect(page.getByRole('heading', { name: 'Daily check-in' })).toBeVisible()
  await expect(page.getByText('Step 1 of 12')).toBeVisible()
  await expect(page.getByText('Editing')).toBeVisible()

  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('good', { exact: true })
    .click()

  await page.getByRole('button', { name: 'Save & close' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
  await page.waitForURL('**/#/')

  const updatedRow = page
    .locator('.card')
    .filter({ hasText: 'Recent check-ins' })
    .locator('li', { hasText: formatIsoDateForDisplay(yesterday) })
  await expect(updatedRow).toContainText('recorded')
  await expect(updatedRow.getByRole('link', { name: 'Edit' })).toBeVisible()
})

test('Home date picker navigates straight to a chosen day’s check-in', async ({
  page,
}) => {
  const twoDaysAgo = addDays(today, -2)
  await page.goto('/#/')
  await page.getByText('+ Fill in an earlier day').click()
  await page.getByLabel('Date').fill(twoDaysAgo)
  await page.getByRole('button', { name: 'Go' }).click()

  await expect(page.getByRole('heading', { name: 'Daily check-in' })).toBeVisible()
  await expect(page.getByText('Editing')).toBeVisible()
})

test('an unusable date in the URL falls back to today with a notice', async ({
  page,
}) => {
  const future = addDays(today, 5)
  await page.goto(`/#/check-in/${future}`)
  await expect(
    page.getByText("That date isn't available; showing today instead."),
  ).toBeVisible()
  await page.waitForURL('**/#/check-in')
  await expect(page.getByText('Editing')).not.toBeVisible()
})
