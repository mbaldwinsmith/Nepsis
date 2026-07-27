import { test, expect } from '@playwright/test'

test('loads the app, completes a check-in, and reflects it on the home screen', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: 'Nepsis' })).toBeVisible()

  await page.getByRole('link', { name: /Start daily check-in/i }).click()
  await expect(page.getByRole('heading', { name: 'Daily check-in' })).toBeVisible()

  // The scale radios are visually hidden in favour of their styled <label>,
  // so click the visible label text (as a real user would) rather than the input.
  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('3', { exact: true })
    .click()
  await page
    .getByRole('radiogroup', { name: 'Low mood' })
    .getByText('1', { exact: true })
    .click()

  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()

  await page.goto('/')
  await expect(page.getByText(/Check-in recorded/i)).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Update today.?s check-in/i }),
  ).toBeVisible()
})

test('all primary routes render without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  for (const path of [
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
    '/more',
  ]) {
    await page.goto(`/#${path}`)
    await expect(page.locator('body')).toBeVisible()
  }

  expect(errors).toEqual([])
})

test('check-in form is usable at 320px width without horizontal scroll', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/#/check-in')
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('2', { exact: true })
    .click()
  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
})
