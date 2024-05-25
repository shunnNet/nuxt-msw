import { http, HttpResponse } from 'msw'

const baseURL = 'http://localhost:3000'

export default defineNuxtMswOption({
  baseURL,
  handlers: () => {
    const results = [
      // Intercept "GET https://example.com/user" requests...
      http.get((import.meta.server ? baseURL : '') + '/api/user', () => {
        // ...and respond to them using this JSON response.
        return HttpResponse.json({
          id: 'id1',
          firstName: 'John',
          lastName: 'Maverick',
        })
      }),
    ]
    if (import.meta.server) {
      return results
    }
    const url = new URL(window.location.href)

    const alternative = url.searchParams.get('alternative')
    if (alternative === 'true') {
      results.unshift(
        // Intercept "GET https://example.com/user" requests...
        http.get('/api/user', () => {
          // ...and respond to them using this JSON response.
          return HttpResponse.json({
            id: 'id2',
            firstName: 'Jane',
            lastName: 'Doe',
          })
        }),
      )
    }
    return results
  },
  workerOptions: {
    quiet: true,
  },
})
