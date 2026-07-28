import { test, expect } from '@playwright/test'

test('records a commitment and marks it cancelled for distress-related reasons', async ({
  page,
}) => {
  await page.goto('/#/commitments')

  await page.getByLabel('Title (optional)').fill('Lunch with a friend')
  await page
    .getByRole('radiogroup', { name: 'Type' })
    .getByText('Friends', { exact: true })
    .click()
  await page
    .getByRole('radiogroup', { name: 'Importance' })
    .getByText('Meaningful', { exact: true })
    .click()
  await page.getByRole('button', { name: 'Add commitment' }).click()
  await expect(page.getByText('Lunch with a friend')).toBeVisible()

  const card = page.locator('div.card').filter({ hasText: 'Lunch with a friend' })
  await card.getByRole('button', { name: 'Cancelled' }).click()
  await expect(card.getByText('Reason (select any that apply)')).toBeVisible()
  await card.getByText('Distress', { exact: true }).click()

  await page.reload()
  const reloadedCard = page.locator('div.card').filter({ hasText: 'Lunch with a friend' })
  await expect(reloadedCard.getByRole('checkbox', { name: 'Distress' })).toBeChecked()
})

test('submits an observer entry and it appears in the app without console errors', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/#/observer')
  await page.getByLabel('Your label (e.g. Mum, Dad, Friend A)').fill('Friend A')
  await page
    .getByRole('radiogroup', { name: 'Perceived mood' })
    .getByText('Usual', { exact: true })
    .click()
  await page
    .getByRole('radiogroup', { name: 'Concern' })
    .getByText('Keep watching', { exact: true })
    .click()
  await page.getByRole('button', { name: 'Save observation' }).click()

  await expect(page.getByText('Observer: Friend A')).toBeVisible()
  await expect(page.getByText('Concern: keepWatching')).toBeVisible()
  expect(errors).toEqual([])
})
