import { createFetch } from 'ofetch'
import { setupServer } from 'msw/node'
// import UserName from './fixtures/basic/components/UserName.vue'
import defu from 'defu'
import { _mswTestOptions } from '#imports'
import type { TNuxtMswTestOptions } from '#imports'

export const setupNuxtMswServer = async (options: TNuxtMswTestOptions = {}) => {
  const _mswOptions = defu(options, _mswTestOptions())
  const server = setupServer(
    ...(
      typeof _mswOptions.handlers === 'function'
        ? _mswOptions.handlers()
        : _mswOptions.handlers
    ),
  )
  /**
   * The trick used at server side is not working here.
   *
   * Because h3 is not really listening in test environment.
   *
   * So here, we do the same thing as server side, but with little different.
   *
   * Detect the request path, if it match h3 registry (which set by @nuxt/test-utils),
   *
   * redirect to its custom fetch (which is in $ofetch.native).
   */
  console.log('Start msw server...')
  await server.listen(_mswOptions.serverOptions)
  const baseURL = _mswOptions.baseURL || ''
  const originalOFetch = globalThis.$fetch

  // @ts-expect-error - msw internal
  const h3Register = __registry as Set<string>

  // @ts-expect-error - msw internal
  const localFetch = (init, options) => {
    if (!baseURL) {
      // @ts-expect-error - msw internal
      return originalOFetch.native(init, options)
    }
    const url = typeof init === 'string' ? init : String(init)
    if (url.startsWith(baseURL)) {
      const path = url.slice(baseURL.length).split('?')[0]
      if (h3Register.has(path)) {
        // @ts-expect-error - msw internal
        return originalOFetch.native(init, options)
      }
    }
    return globalThis.fetch(init, options)
  }

  // set patched fetch to $fetch
  globalThis.$fetch = createFetch({
    fetch: localFetch,
    Headers: globalThis.Headers,
    defaults: { baseURL },
  })

  return server
}
