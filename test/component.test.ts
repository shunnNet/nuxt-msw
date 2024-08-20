// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { http, HttpResponse } from 'msw'
import { setupNuxtMswServer } from '../src/runtime/test-utils'
import UserName from './fixtures/basic/components/UserName.vue'

setupNuxtMswServer({
  baseURL: 'http://localhost:3001',
  handlers: [
    http.get('http://localhost:3001/api/user', () => {
      // ...and respond to them using this JSON response.
      // TODO: nuxt default 3000 in test-utils ?
      return HttpResponse.json({
        id: '3001',
        name: 'msw server unit',
      })
    }),
    http.get('http://localhost:3003/api/user', () => {
      // ...and respond to them using this JSON response.
      // TODO: nuxt default 3000 in test-utils ?
      return HttpResponse.json({
        id: '3002',
        name: 'msw server unit',
      })
    }),
  ],
})

it('displays message', async () => {
  const component = await mountSuspended(UserName)

  expect(component.find('#name').text()).toBe('msw server unit')
})
