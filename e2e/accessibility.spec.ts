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
