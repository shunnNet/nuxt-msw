import { http, HttpResponse } from 'msw'

export default defineNuxtMswServerOption(() => {
  const baseURL = useRuntimeConfig().public.msw?.baseURL
  const handlers = [
    // Intercept "GET https://example.com/user" requests...
    // http.get(baseURL + '/api/user', () => {
    //   // ...and respond to them using this JSON response.
    //   return HttpResponse.json({
    //     id: 'Mock03 layer',
    //     firstName: 'Mock layer',
    //     lastName: 'User layer',
    //   })
    // }),
  ]
  return {
    // baseURL,
    handlers,
    serverOptions: {
      onUnhandledRequest: 'bypass',
    },

    onRequest() {
      console.log('Hello from onRequest layer')
    },
    // afterResponse(mswServer, event) {
    //   console.log('Hello from afterResponse')
    // },
  }
})
