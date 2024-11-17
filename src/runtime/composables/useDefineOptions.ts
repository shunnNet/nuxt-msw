import type { HttpHandler, SharedOptions } from 'msw'
import type { StartOptions, SetupWorkerApi } from 'msw/browser'
import type { SetupServerApi } from 'msw/node'
import type { H3Event } from 'h3'
import type { NuxtApp } from '#app'

export type TNuxtMswWorkerOptions = {
  /**
   * Define the handlers passed to `setupWorker()`.
   *
   * - See [Dynamic Mocking](https://mswjs.io/docs/best-practices/dynamic-mock-scenarios)
   * - See [setupWorker](https://mswjs.io/docs/api/setup-worker)
   */
  handlers: HttpHandler[]

  /**
   * options for the `worker.start()`.
   *
   * See https://mswjs.io/docs/api/setup-worker/start
   */
  workerOptions?: Partial<StartOptions>

  /**
   * Triggered when msw worker start in nuxt client plugin.
   * @param worker msw worker instance
   * @param nuxtApp nuxtApp instance
   * @returns
   */
  onWorkerStarted?: (worker: SetupWorkerApi, nuxtApp: NuxtApp) => void | Promise<void>
}

export type TNuxtMswServerOptions = {
  /**
   *  Indicate baseURL of Nuxt server. e.g: `http://localhost:3000`
   *
   * Required if you use `useFetch` or `$fetch` with relative URL in your app.
   */
  baseURL: string
  /**
   * Define the handlers passed to `setupServer()`.
   *
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
   * Triggered when the Nitro server get a request.
   * @param server msw server instance
   * @param event H3Event. See [H3](https://h3.unjs.io)
   * @returns
   */
  onRequest?: (server: SetupServerApi, event: H3Event) => void | Promise<void>

  /**
   * Triggered after the Nitro server send a response.
   * @param server msw server instance
   * @param event H3Event. See [H3](https://h3.unjs.io)
   * @returns
   */
  // afterResponse?: (server: SetupServerApi, event: H3Event) => void | Promise<void>
}

/**
 * Defines the Nuxt MSW Worker option.
 *
 * @param options - The Nuxt MSW Worker options or a function that returns the options.
 * @returns A function return Nuxt MSW Worker options.
 *
 * @see https://github.com/shunnNet/nuxt-msw?tab=readme-ov-file#worker
 */
export const defineNuxtMswWorkerOption = (
  options: TNuxtMswWorkerOptions | (() => TNuxtMswWorkerOptions),
) => {
  return typeof options === 'function'
    ? options
    : () => options
}
/**
 * Defines the Nuxt MSW Server option.
 *
 * @param options - The Nuxt MSW Server options or a function that returns the options.
 * @returns A function return Nuxt MSW Server options.
 *
 * @see https://github.com/shunnNet/nuxt-msw?tab=readme-ov-file#server
 */
export const defineNuxtMswServerOption = (
  options: TNuxtMswServerOptions | (() => TNuxtMswServerOptions),
) => {
  return typeof options === 'function'
    ? options
    : () => options
}

export type TNuxtMswTestOptions = {
  /**
   *  Any baseURL, for mocking $fetch and useFetch. e.g: `http://localhost:3000`
   *  Required if you use `useFetch` or `$fetch` with relative URL in your app.
   */
  baseURL?: string

  /**
   * Define the handlers passed to `setupServer()`.
   */
  handlers?: HttpHandler[]

  /**
   * Options for the `server.listen()`.
   *
   * See https://mswjs.io/docs/api/setup-server/listen
   */
  serverOptions?: Partial<SharedOptions>
}
/**
 *
 * Defines the Nuxt MSW Server option when working with `@nuxt/test-utils`.
 *
 * @param options - The Nuxt MSW Server options or a function that returns the options.
 * @returns A function return Nuxt MSW Server options.
 *
 * @see https://github.com/shunnNet/nuxt-msw?tab=readme-ov-file#nuxt-layer-and-unit-test
 */
export const defineNuxtMswTestOptions = (
  options: TNuxtMswTestOptions | (() => TNuxtMswTestOptions),
) => {
  return typeof options === 'function'
    ? options
    : () => options
}
