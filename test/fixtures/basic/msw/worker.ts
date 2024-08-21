import { http, HttpResponse } from 'msw'

export default defineNuxtMswWorkerOption(() => {
  const handlers = [
    // Intercept "GET https://example.com/user" requests...
    http.get('/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        id: 'Mock01',
        name: 'msw worker',

      })
    }),
  ]

  return {
    handlers,
    workerOptions: {
      quiet: true,
      onUnhandledRequest: 'bypass',
    },
    // onWorkerStarted(worker, nuxtApp) {
    //   console.log('Worker started!')
    //   console.log(worker.listHandlers())
    //   console.log(nuxtApp._id)
    // },
  }
})
