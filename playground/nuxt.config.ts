export default defineNuxtConfig({
  modules: ['../src/module', '@nuxt/test-utils/module'],
  devtools: { enabled: true },
  msw: {
    enable: true,
  },
})
