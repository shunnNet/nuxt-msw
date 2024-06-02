import type { HttpHandler, SharedOptions } from 'msw'
import type { StartOptions } from 'msw/browser'

export type TNuxtMswOptions = {
  /**
   *  Indicate baseURL of Nuxt server. e.g: `http://localhost:3000`
   *  Required if you use `useFetch` or `$fetch` with relative URL in your app.
   */
  baseURL?: string
  /**
   * Define the handlers passed to `setupWorker()` and `setupServer()`.
   *
   * You can pass different handlers for client-side and server-side.
   *
   * - See [Dynamic Mocking](https://mswjs.io/docs/best-practices/dynamic-mock-scenarios)
   * - See [setupWorker](https://mswjs.io/docs/api/setup-worker)
   * - See [setupServer](https://mswjs.io/docs/api/setup-server)
   */
  handlers: HttpHandler[]
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
 * Defines the Nuxt MSW option.
 *
 * @param options - The Nuxt MSW options or a function that returns the options.
 * @returns A function return Nuxt MSW options.
 */
export const defineNuxtMswOption = (
  options: TNuxtMswOptions | (() => TNuxtMswOptions),
) => {
  return typeof options === 'function'
    ? options
    : () => options
}
