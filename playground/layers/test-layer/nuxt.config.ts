export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      msw: {
        baseURL: 'http://localhost:3000',
      },
    },
  },
  modules: ['../src/module'],
  // devtools: { enabled: true },
  msw: {
    enable: true,
    folderPath: './msw',
  },
})
