import { http, HttpResponse } from 'msw'

export default defineNuxtMswServerOption(() => {
  const baseURL = useRuntimeConfig().public.msw?.baseURL
  const handlers = [
    // Intercept "GET https://example.com/user" requests...
    http.get(baseURL + '/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        id: 'Mock03',
        firstName: 'Mock',
        lastName: 'User',
      })
    }),
  ]

  return {
    baseURL,
    handlers,
    serverOptions: {
      quiet: true,
      onUnhandledRequest: 'bypass',
    },
    // onRequest(mswServer, event) {
    //   console.log('Hello from onRequest layer')
    // },
    // afterResponse(mswServer, event) {
    //   console.log('Hello from afterResponse')
    // },
  }
})
