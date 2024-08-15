export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      msw: {
        baseURL: 'http://localhost:3001',
      },
    },
  },
  modules: ['../src/module'],
  // devtools: { enabled: true },
  msw: {
    enable: true,
    optionPath: './msw',
  },
})
