import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const CORE_ROUTES = [
  '/',
  '/check-in',
  '/observer',
  '/commitments',
  '/health',
  '/medication',
  '/trends',
  '/safety-plan',
  '/settings',
  '/settings/rules',
  '/settings/data',
  '/settings/install',
  '/settings/privacy',
  '/more',
]

test.beforeEach(async ({ page }) => {
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()
})

for (const path of CORE_ROUTES) {
  test(`no automated accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(`/#${path}`)
    // Secondary routes are lazy-loaded; wait past the Suspense fallback (a
    // plain "Loading…" with no landmark heading) before scanning.
    await expect(page.locator('h1')).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}

test('no automated accessibility violations on any of the 12 check-in steps or the review screen', async ({
  page,
}) => {
  await page.goto('/#/check-in')
  await expect(page.getByText('Step 1 of 12')).toBeVisible()

  for (let step = 1; step <= 12; step++) {
    await expect(page.getByText(`Step ${step} of 12`)).toBeVisible()
    const results = await new AxeBuilder({ page }).analyze()
    expect(
      results.violations,
      `Step ${step}: ${JSON.stringify(results.violations, null, 2)}`,
    ).toEqual([])
    await page.getByRole('button', { name: /^(Continue|Review)$/ }).click()
  }

  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
  const reviewResults = await new AxeBuilder({ page }).analyze()
  expect(
    reviewResults.violations,
    JSON.stringify(reviewResults.violations, null, 2),
  ).toEqual([])
})

test('no automated accessibility violations on the trends compare card with metrics selected', async ({
  page,
}) => {
  await page.goto('/#/trends')
  await expect(page.getByRole('img', { name: /Trend chart for/ })).toBeVisible()

  // Swap out a metric to exercise the compare card's chip-selection state,
  // not just its default rendering. The checkbox inputs are visually hidden
  // in favour of their styled <label>, so click the visible label text.
  await page.getByText('Sleep duration', { exact: true }).click()
  await page.getByText('Weight', { exact: true }).click()
  await expect(page.getByRole('img', { name: /Trend chart for/ })).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
})
