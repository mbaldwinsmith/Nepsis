import { test, expect } from '@playwright/test'

test('export CSV, create an encrypted backup, delete all data, then restore from that backup', async ({
  page,
}) => {
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Load seed data' }).click()
  await expect(page.getByText('Fictional seed data loaded')).toBeVisible()

  await page.goto('/#/settings/data')

  // CSV export downloads one file per category (6 categories, one of which —
  // medications and transitions — produces 3 files) plus one data dictionary.
  const csvDownloads: string[] = []
  page.on('download', (download) => csvDownloads.push(download.suggestedFilename()))
  await page.getByRole('button', { name: 'Export CSV' }).click()
  await expect.poll(() => csvDownloads.length).toBe(9)
  expect(csvDownloads.some((name) => name.startsWith('nepsis-daily-check-ins-'))).toBe(
    true,
  )
  expect(csvDownloads.some((name) => name.startsWith('nepsis-data-dictionary-'))).toBe(
    true,
  )
  page.removeAllListeners('download')

  // Create an encrypted backup and keep its downloaded path for restore below.
  const backupSection = page
    .locator('section.card')
    .filter({ has: page.getByRole('heading', { name: 'Encrypted backup', exact: true }) })
  await backupSection
    .getByLabel('Passphrase', { exact: true })
    .fill('correct horse battery staple')
  await backupSection
    .getByLabel('Confirm passphrase', { exact: true })
    .fill('correct horse battery staple')
  const [backupDownload] = await Promise.all([
    page.waitForEvent('download'),
    backupSection.getByRole('button', { name: 'Create encrypted backup' }).click(),
  ])
  expect(backupDownload.suggestedFilename()).toMatch(/^nepsis-backup-.*\.json$/)
  const backupPath = await backupDownload.path()
  expect(backupPath).toBeTruthy()
  await expect(page.getByText('Encrypted backup downloaded')).toBeVisible()

  // Delete everything so the restore below is verifiably restoring, not just
  // finding data that was already there.
  await page.goto('/#/settings')
  await page.getByRole('button', { name: 'Delete all local data' }).click()
  await page.getByRole('button', { name: 'Yes, delete everything' }).click()
  await expect(page.getByText('All local data deleted')).toBeVisible()

  await page.goto('/#/commitments')
  await expect(page.getByText('Church service')).toHaveCount(0)

  // Restore from the backup created above.
  await page.goto('/#/settings/data')
  const restoreSection = page.locator('section.card').filter({
    has: page.getByRole('heading', { name: 'Restore from backup', exact: true }),
  })
  await restoreSection.locator('input[type="file"]').setInputFiles(backupPath!)
  await restoreSection
    .getByLabel('Passphrase', { exact: true })
    .fill('correct horse battery staple')
  await restoreSection.getByRole('button', { name: 'Preview backup' }).click()
  await expect(restoreSection.getByText(/Backup created/)).toBeVisible()
  await expect(restoreSection.getByText(/Commitments: \d+/)).toBeVisible()

  await restoreSection
    .getByRole('radiogroup', { name: 'What should happen to your existing data?' })
    .getByText('Replace all', { exact: true })
    .click()
  await restoreSection.getByRole('button', { name: 'Restore' }).click()
  await expect(page.getByText('Restore complete')).toBeVisible()

  await page.goto('/#/commitments')
  await expect(page.getByText('Church service')).toBeVisible()
})
