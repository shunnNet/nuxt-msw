import type { HttpHandler, SharedOptions } from 'msw'
import type { StartOptions } from 'msw/browser'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type TNuxtMswOptions = {
  /**
   *  Indicate baseURL of Nuxt server.
   *  Required if you use `useFetch`, `useAsyncData` or `$fetch` with relative URL in your app.
   */
  baseURL?: string
  /**
   * Define the handlers passed to `setupWorker()` and `setupServer()`.
   *
   * You can use a array of handlers or a function that returns a array of handlers.
   *
   * You can pass different handlers for client-side and server-side.
   *
   * - See [Dynamic Mocking](https://mswjs.io/docs/best-practices/dynamic-mock-scenarios)
   * - See [setupWorker](https://mswjs.io/docs/api/setup-worker)
   * - See [setupServer](https://mswjs.io/docs/api/setup-server)
   */
  handlers: HttpHandler[] | ((route?: RouteLocationNormalizedLoaded) => HttpHandler[])
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
