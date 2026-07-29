/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import packageJson from './package.json' with { type: 'json' }

// GitHub Pages serves this project from https://<user>.github.io/Nepsis/, a
// subpath — every asset, icon, and manifest URL needs that prefix. Local dev,
// preview, and tests keep the default '/' so nothing else has to change.
// The deploy workflow sets GITHUB_PAGES=true before building.
const base = process.env.GITHUB_PAGES === 'true' ? '/Nepsis/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg'],
      manifest: {
        id: base,
        name: 'Nepsis',
        short_name: 'Nepsis',
        description:
          'A private, local-first tracker for mood, behaviour, and medication-transition observations.',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#f6f5f2',
        theme_color: '#1f2430',
        icons: [
          {
            src: `${base}icons/icon-192.svg`,
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-512.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: `${base}icons/icon-maskable.svg`,
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    exclude: ['node_modules/**', 'dist/**', 'e2e/**', 'e2e-offline/**'],
  },
})
