import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const handlers = [
  http.get('/api/user', () => {
    // ...and respond to them using this JSON response.
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]

setupServer(...handlers).listen()

;(async function () {
  const response = await fetch('http://localhost/api/user')
  const body = await response.json()

  console.log(body)
})()
