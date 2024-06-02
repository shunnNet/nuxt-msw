import type { NitroApp } from 'nitropack'
import { setupServer } from 'msw/node'
import { createFetch, Headers } from 'ofetch'
import { mswOptions } from '#imports'

type NitroPlugin = (nitroApp: NitroApp) => void
const defineNitroPlugin = (def: NitroPlugin): NitroPlugin => def
/**
 * `setupServer` will overwrite `globalThis.fetch` which will
 * be used by ofetch setup by nitro
 * So, all `createFetch` exported by ofetch use mocked fetch
 * Run here before nitro before initialization
 */
const _mswOptions = mswOptions()
const server = setupServer(...(
  typeof mswOptions.handlers === 'function'
    ? mswOptions.handlers()
    : mswOptions.handlers
))
server.listen(mswOptions.serverOptions)

console.log('MSW server start listen.')

export default defineNitroPlugin((nitroApp) => {
  /**
   * For overwriting directly call server handler behaviour of Nitro.
   */
  globalThis.$fetch = createFetch({
    fetch: globalThis.fetch,
    Headers,
    defaults: { baseURL: _mswOptions.baseURL || '' },
  })
  nitroApp.hooks.hook('request', (event) => {
    event.context.$mswServer = server
  })
})
