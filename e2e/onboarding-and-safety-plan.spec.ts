import { test, expect } from '@playwright/test'

test('enter a personal baseline and a safety plan, then confirm both persist across a reload', async ({
  page,
}) => {
  await page.goto('/#/settings')
  await page.getByLabel('Usual sleep duration (minutes)').fill('440')
  await page.getByLabel('Usual appetite (0-4)').fill('2')
  await page.getByLabel('Usual satiety (0-4)').fill('3')
  await page.getByRole('button', { name: 'Save baseline' }).click()
  await expect(page.getByText('Baseline saved')).toBeVisible()

  await page.goto('/#/safety-plan')
  const trustedContacts = page
    .getByRole('heading', { name: 'Trusted contacts' })
    .locator('xpath=..')
  await trustedContacts.getByLabel('Label').fill('Partner')
  await trustedContacts.getByLabel('Details').fill('Call any time, day or night')
  await trustedContacts.getByRole('button', { name: 'Add contact' }).click()
  await expect(page.getByText('Partner')).toBeVisible()
  await expect(page.getByText('Call any time, day or night')).toBeVisible()

  await page
    .getByLabel("What 'review' means for me")
    .fill('Reach out to a trusted contact and slow down for a day.')
  await page.getByRole('button', { name: 'Save safety plan' }).click()
  await expect(page.getByText('Safety plan saved')).toBeVisible()

  // Reload and navigate back to both pages to confirm the saved data was
  // actually persisted to IndexedDB, not just kept in in-memory state.
  await page.reload()
  await page.goto('/#/settings')
  await expect(page.getByLabel('Usual sleep duration (minutes)')).toHaveValue('440')

  await page.goto('/#/safety-plan')
  await expect(page.getByText('Partner')).toBeVisible()
  await expect(page.getByLabel("What 'review' means for me")).toHaveValue(
    'Reach out to a trusted contact and slow down for a day.',
  )
})
