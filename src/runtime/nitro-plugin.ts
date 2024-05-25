import type { NitroApp } from 'nitropack'
import { setupServer } from 'msw/node'
import { createFetch, Headers } from 'ofetch'
import { mswOptions } from '#imports'

type NitroPlugin = (nitroApp: NitroApp) => void
const defineNitroPlugin = (def: NitroPlugin): NitroPlugin => def

const server = setupServer(...(
  typeof mswOptions.handlers === 'function'
    ? mswOptions.handlers()
    : mswOptions.handlers
))
server.listen(mswOptions.serverOptions)

console.log('MSW server start listen.')

export default defineNitroPlugin((nitroApp) => {
  globalThis.$fetch = createFetch({
    fetch: globalThis.fetch,
    Headers,
    defaults: { baseURL: mswOptions.baseURL || '/' },
  })
  nitroApp.hooks.hook('request', (event) => {
    event.context.$mswServer = server
  })
})
