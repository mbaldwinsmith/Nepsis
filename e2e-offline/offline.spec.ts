import { test, expect } from '@playwright/test'

const CORE_ROUTES = [
  '/',
  '/check-in',
  '/observer',
  '/commitments',
  '/health',
  '/medication',
  '/trends',
  '/settings',
]

test('the web manifest has everything a browser needs to consider the app installable', async ({
  page,
}) => {
  await page.goto('/#/')
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel="manifest"]')?.getAttribute('href')
    if (!href) return null
    const response = await fetch(href)
    return response.json()
  })

  expect(manifest).toMatchObject({
    name: 'Nepsis',
    short_name: 'Nepsis',
    display: 'standalone',
    start_url: expect.any(String),
  })
  expect(manifest.icons.length).toBeGreaterThan(0)
})

test('app shell and core routes work after the network goes offline', async ({
  page,
  context,
}) => {
  // First load online: register the service worker and let it precache the
  // app shell. Reload once more (still online) so this page itself is now
  // under the service worker's control, not just future tabs.
  await page.goto('/#/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)

  await context.setOffline(true)

  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.reload()
  await expect(page.getByRole('heading', { name: 'Nepsis' })).toBeVisible()

  for (const path of CORE_ROUTES) {
    await page.goto(`/#${path}`)
    await expect(page.locator('body')).toBeVisible()
  }
  expect(errors).toEqual([])

  // Creating a check-in offline only touches IndexedDB, never the network.
  await page.goto('/#/check-in')
  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('good', { exact: true })
    .click()
  for (let i = 0; i < 12; i++) {
    await page.getByRole('button', { name: /^(Continue|Review)$/ }).click()
  }
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
})
