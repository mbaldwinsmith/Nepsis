import { defineConfig, devices } from '@playwright/test'

// Offline behaviour depends on the service worker, which vite-plugin-pwa
// only registers in a production build (devOptions.enabled: false) — the
// main playwright.config.ts intentionally runs against `npm run dev` instead,
// for dev-only affordances like seed data, so it can never exercise this.
export default defineConfig({
  testDir: './e2e-offline',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  workers: 1,
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: { executablePath: '/opt/pw-browsers/chromium' },
      },
    },
  ],
})
