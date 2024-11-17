import { resolve } from 'node:path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    include: [
      'test/**/*.test.ts',
    ],
    setupFiles: [
      // resolve(__dirname, 'test/setup.ts'),

    ],
    // environment: 'nuxt',

    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',

        rootDir: resolve(__dirname, './test/fixtures/basic'), // for component test
        overrides: {
          msw: {
            // enable: false,
            testUtils: true,
          },
        },
      },
    },
  },
})
