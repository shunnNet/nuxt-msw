import { fileURLToPath } from 'node:url'
import { defineConfig } from '@playwright/test'
import type { ConfigOptions } from '@nuxt/test-utils/playwright'

export default defineConfig<ConfigOptions>({
  use: {
    nuxt: {
      rootDir: fileURLToPath(new URL('./test/fixtures/basic', import.meta.url)),
    },
    headless: false,
    channel: 'chrome',
  },
  testDir: fileURLToPath(new URL('./e2e', import.meta.url)),
})
