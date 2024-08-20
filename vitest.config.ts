import { resolve } from 'node:path'
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    include: [
      // 'test/**/*.test.ts',
      // 'test/**/basic.test.ts',
      'test/**/component.test.ts',

    ],
    setupFiles: [
      // resolve(__dirname, 'test/setup.ts'),

    ],
    // environment: 'nuxt',

    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',

        port: 3002,
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
