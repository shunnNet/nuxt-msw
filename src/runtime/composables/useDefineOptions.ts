import type { HttpHandler, SharedOptions } from 'msw'
import type { StartOptions } from 'msw/browser'

type TNuxtMswOptions = {
  /**
   *  Indicate baseURL of Nuxt server.
   *  Required if you use `useFetch`, `useAsyncData` or `$fetch` with relative URL in your app.
   */
  baseURL?: string
  /**
   * Define the handlers passed to **BOTH** `setupWorker()` and `setupServer()`.
   * - See [setupWorker](https://mswjs.io/docs/api/setup-worker)
   * - See [setupServer](https://mswjs.io/docs/api/setup-server)
   */
  handlers: HttpHandler[] | (() => HttpHandler[])
  /**
   * Options for the `server.listen()`.
   *
   * See https://mswjs.io/docs/api/setup-server/listen
   */
  serverOptions?: Partial<SharedOptions>
  /**
   * options for the `worker.start()`.
   *
   * See https://mswjs.io/docs/api/setup-worker/start
   */
  workerOptions?: Partial<StartOptions>
}

/**
 * Define the options for the nuxt-msw in runtime.
 *
 * @param options - The options to define.
 * @returns The options defined.
 */
export const defineNuxtMswOption = (options: TNuxtMswOptions) => {
  return options
}
