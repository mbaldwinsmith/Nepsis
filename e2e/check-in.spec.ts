import { test, expect, type Page } from '@playwright/test'
import { BANNED_PHRASES } from '../src/utils/prohibitedWording'

/** Clicks the wizard's primary nav button ("Continue" or, on the last step, "Review") `count` times. */
async function advanceSteps(page: Page, count: number) {
  for (let i = 0; i < count; i++) {
    await page.getByRole('button', { name: /^(Continue|Review)$/ }).click()
  }
}

test('loads the app, completes a check-in, and reflects it on the home screen', async ({
  page,
}) => {
  await page.goto('/#/')
  await expect(page.getByRole('heading', { name: 'Nepsis' })).toBeVisible()

  await page.getByRole('link', { name: /Start daily check-in/i }).click()
  await expect(page.getByRole('heading', { name: 'Daily check-in' })).toBeVisible()
  await expect(page.getByText('Step 1 of 12')).toBeVisible()

  // Step 1 of 12: sleep last night. The scale radios are visually hidden in
  // favour of their styled <label>, so click the visible label text as a
  // real user would, rather than the input.
  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('good', { exact: true })
    .click()
  await advanceSteps(page, 1)
  await expect(page.getByText('Step 2 of 12')).toBeVisible()

  // Step 2: falling asleep and waking. Step 3: daytime rest. Skip both.
  await advanceSteps(page, 2)
  await expect(page.getByText('Step 4 of 12')).toBeVisible()

  // Step 4: how today felt.
  await page
    .getByRole('radiogroup', { name: 'Low mood' })
    .getByText('slight', { exact: true })
    .click()

  // Steps 5-11: skip pace and drive, warning signs, alcohol, other people,
  // eating, urges, and medication, landing on step 12 (note).
  await advanceSteps(page, 8)
  await expect(page.getByText('Step 12 of 12')).toBeVisible()

  await advanceSteps(page, 1)
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()

  // A skipped scale should be absent from what's about to be saved, not
  // recorded as 0 — assert its review row is "Not recorded".
  const lastNightCard = page.locator('.card').filter({ hasText: 'Last night' })
  await expect(lastNightCard.getByText('good')).toBeVisible()
  const wakingCard = page
    .locator('.card')
    .filter({ hasText: 'Falling asleep and waking' })
  await expect(wakingCard.getByText('Not recorded')).toBeVisible()

  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
  // Saving navigates back to Home; wait for that to settle before continuing.
  await page.waitForURL('**/#/')

  await expect(page.getByText(/Check-in recorded/i)).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Update today.?s check-in/i }),
  ).toBeVisible()

  // Re-open today's check-in, change a value on the first step, walk to the
  // review, and confirm the edit persists.
  await page.getByRole('link', { name: /Update today.?s check-in/i }).click()
  await expect(page.getByRole('heading', { name: 'Daily check-in' })).toBeVisible()
  await expect(page.getByText('Step 1 of 12')).toBeVisible()
  await expect(
    page
      .getByRole('radiogroup', { name: 'Sleep quality' })
      .getByRole('radio', { name: 'Sleep quality: good' }),
  ).toBeChecked()

  await page
    .getByRole('radiogroup', { name: 'Sleep quality' })
    .getByText('very good', { exact: true })
    .click()

  await advanceSteps(page, 12)
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
  await page.getByRole('button', { name: 'Update check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
  await page.waitForURL('**/#/')
  await expect(page.getByText(/Check-in recorded/i)).toBeVisible()

  // Navigate back in fresh to confirm persistence.
  await page.goto('/#/check-in')
  await expect(
    page
      .getByRole('radiogroup', { name: 'Sleep quality' })
      .getByRole('radio', { name: 'Sleep quality: very good' }),
  ).toBeChecked()
})

test('records a lunchtime nap and alcohol units on their own steps, including their conditional fields', async ({
  page,
}) => {
  await page.goto('/#/check-in')

  // Step 3 of 12: daytime rest — nap taken reveals duration and after-effect.
  await advanceSteps(page, 2)
  await expect(page.getByText('Step 3 of 12')).toBeVisible()
  // The switch input itself is visually hidden in favour of the styled
  // track, so click the visible label text — a native <label> forwards the
  // click to its paired input regardless of which descendant is clicked.
  await page.getByText('Nap taken', { exact: true }).click()
  await expect(page.getByLabel('Nap duration (minutes)')).toBeVisible()
  await page.getByLabel('Nap duration (minutes)').fill('30')
  await page
    .getByRole('radiogroup', { name: 'Nap after-effect' })
    .getByText('Refreshed', { exact: true })
    .click()

  // Steps 4-6: skip mood and warning signs to reach step 7, alcohol.
  await advanceSteps(page, 4)
  await expect(page.getByText('Step 7 of 12')).toBeVisible()

  await page.getByLabel('Units consumed').fill('2')
  await expect(page.getByRole('radiogroup', { name: 'Context' })).toBeVisible()
  await page
    .getByRole('radiogroup', { name: 'Context' })
    .getByText('Social', { exact: true })
    .click()
  await page
    .getByRole('radiogroup', { name: 'Perceived effect' })
    .getByText('Neutral', { exact: true })
    .click()

  // Walk the rest of the way to the review (social, eating, urges,
  // medication, note, then the "Review" click itself), then save.
  await advanceSteps(page, 6)
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
  await page.waitForURL('**/#/')
  await expect(page.getByText(/Check-in recorded/i)).toBeVisible()

  // Navigate back in fresh to confirm persistence.
  await page.goto('/#/check-in')
  await advanceSteps(page, 2)
  await expect(page.getByText('Step 3 of 12')).toBeVisible()
  await expect(page.getByLabel('Nap duration (minutes)')).toHaveValue('30')
  await advanceSteps(page, 4)
  await expect(page.getByText('Step 7 of 12')).toBeVisible()
  await expect(page.getByLabel('Units consumed')).toHaveValue('2')
})

test('all primary routes render without console errors or prohibited wording', async ({
  page,
}) => {
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()

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
    '/settings/data',
    '/settings/install',
    '/settings/privacy',
    '/more',
  ]) {
    await page.goto(`/#${path}`)
    await expect(page.locator('body')).toBeVisible()

    const bodyText = (await page.locator('body').innerText()).toLowerCase()
    for (const phrase of BANNED_PHRASES) {
      expect(bodyText, `${path} contains prohibited wording: "${phrase}"`).not.toContain(
        phrase,
      )
    }
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
    .getByText('poor', { exact: true })
    .click()
  await advanceSteps(page, 12)
  await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible()
  await page.getByRole('button', { name: 'Save check-in' }).click()
  await expect(page.getByText('Check-in saved')).toBeVisible()
})
