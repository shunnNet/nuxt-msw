import type { NitroApp } from 'nitropack'
import { setupServer } from 'msw/node'
import { createFetch, Headers } from 'ofetch'
import { _mswServerOptions } from '#imports'

type NitroPlugin = (nitroApp: NitroApp) => void
const defineNitroPlugin = (def: NitroPlugin): NitroPlugin => def
/**
 * `setupServer` will overwrite `globalThis.fetch` which will
 * be used by ofetch setup by nitro
 * So, all `createFetch` exported by ofetch use mocked fetch
 * Run here before nitro before initialization
 */
const _mswOptions = _mswServerOptions()
const server = setupServer(...(
  typeof _mswOptions.handlers === 'function'
    ? _mswOptions.handlers()
    : _mswOptions.handlers
))
server.listen(_mswOptions.serverOptions)

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
  const onRequest = _mswOptions.onRequest
    ? Array.isArray(_mswOptions.onRequest)
      ? _mswOptions.onRequest
      : [_mswOptions.onRequest]
    : []

  const afterResponse = _mswOptions.afterResponse
    ? Array.isArray(_mswOptions.afterResponse)
      ? _mswOptions.afterResponse
      : [_mswOptions.afterResponse]
    : []

  nitroApp.hooks.hook('request', async (event) => {
    event.context.$mswServer = server
    try {
      for (const fn of onRequest) {
        await fn(server, event)
      }
    }
    catch (e) { console.error(e) }
  })
  nitroApp.hooks.hook('afterResponse', async (event) => {
    try {
      for (const fn of afterResponse) {
        await fn(server, event)
      }
    }
    catch (e) { console.error(e) }
  })
})
