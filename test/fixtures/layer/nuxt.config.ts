import MyModule from '../../../src/module'

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      msw: {
        baseURL: 'http://localhost:3000',
      },
    },
  },
  ssr: true,
  modules: [
    MyModule,
  ],
  extends: ['./layers/test-layer'],
  msw: {
    folderPath: '~/msw',
  },

})
