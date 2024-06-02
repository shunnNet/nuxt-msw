import { http, HttpResponse } from 'msw'
import { defineNuxtMswOption } from '../../../../src/runtime/composables/useDefineOptions'
import { useRuntimeConfig } from '#imports'

export default defineNuxtMswOption(() => {
  const baseURL = useRuntimeConfig().public.msw?.baseURL
  const handlers = [
    // Intercept "GET https://example.com/user" requests...
    http.get((import.meta.server ? baseURL : '') + '/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        id: 'Mock01',
        firstName: 'Mock',
        lastName: 'User',
      })
    }),
  ]
  if (import.meta.client) {
    const url = new URL(window.location.href)

    const alternative = url.searchParams.get('alternative')
    if (alternative === 'true') {
      handlers.unshift(
        // Intercept "GET https://example.com/user" requests...
        http.get('/api/user', () => {
          // ...and respond to them using this JSON response.
          return HttpResponse.json({
            id: 'Mock02',
            firstName: 'Mock',
            lastName: 'USer 22',
          })
        }),
      )
    }
  }
  return {
    baseURL,
    handlers,
    workerOptions: {
      quiet: true,
    },
  }
})
