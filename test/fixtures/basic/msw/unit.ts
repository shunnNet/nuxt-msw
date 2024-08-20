import { http, HttpResponse } from 'msw'

export default defineNuxtMswTestOptions(() => {
  // const baseURL = useRuntimeConfig().public.msw?.baseURL
  // console.log('baseURL', baseURL)
  const handlers = [
    // Intercept "GET https://example.com/user" requests...
    // http.get('/api/user', () => {
    //   // ...and respond to them using this JSON response.
    //   return HttpResponse.json({
    //     id: 'Mock01',
    //     name: 'msw server unit',
    //   })
    // }),
  ]
  return {
    handlers,
    serverOptions: {
      // onUnhandledRequest: 'bypass',
    },
  }

  // afterResponse(mswServer, event) {
  //   console.log('Hello from afterResponse')
  // },
})
