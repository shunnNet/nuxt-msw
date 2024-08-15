export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      msw: {
        baseURL: 'http://localhost:3001',
      },
    },
  },
  modules: [
    // '../src/module',
    '@nuxt/test-utils/module',
  ],
  devtools: { enabled: true },
  extends: [
    './layers/test-layer',
  ],
  msw: {
    optionPath: '~/msw',
    includeLayer: true,
  },
})
