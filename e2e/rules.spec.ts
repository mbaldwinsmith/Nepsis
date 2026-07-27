import { test, expect } from '@playwright/test'

test('enabling a rule surfaces a review card on Home once seed data matches it', async ({
  page,
}) => {
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()

  await page.goto('/#/settings/rules')
  const restlessnessCard = page
    .locator('div.card')
    .filter({ hasText: 'Restlessness review' })
    .first()
  const enabledCheckbox = restlessnessCard.getByLabel('Enabled')
  // Click rather than .check(): the toggle is persisted asynchronously
  // (IndexedDB write + list refresh), so verify the resulting state with
  // an auto-retrying assertion instead of .check()'s single-shot check.
  await enabledCheckbox.click()
  await expect(enabledCheckbox).toBeChecked()

  await page.goto('/#/')
  await expect(page.getByText('Worth reviewing')).toBeVisible()
  const homeCard = page
    .locator('div.card')
    .filter({ hasText: 'Restlessness review' })
    .first()
  await expect(homeCard.getByText('Review', { exact: true })).toBeVisible()
  await expect(homeCard.getByRole('link', { name: 'View safety plan' })).toBeVisible()

  await homeCard.getByRole('button', { name: 'Dismiss' }).click()
  await expect(page.getByText('Restlessness review')).toHaveCount(0)
})
