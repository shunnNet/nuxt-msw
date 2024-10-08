// src/mocks/handlers.js
import { defineNuxtPlugin, useRequestEvent } from '#app'
// import { useNuxtMswHooks, onNuxtMswServerStarted, onNuxtMswWorkerStarted } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  // useNuxtMswHooks(onNuxtMswServerStarted, onNuxtMswWorkerStarted)
  if (!import.meta.server) {
    return
  }
  const event = useRequestEvent()
  _nuxtApp.provide('mswServer', event!.context.$mswServer)

  _nuxtApp.hook('app:created', () => {
    /**
     * For overwriting directly call server handler behaviour of Nitro when `useFetch`.
     * Nitro bind its custom $fetch with event and globalThis.
     * `useFetch` use event.$fetch if it is available.
     * We already mocked globalThis part at nitroPlugin.
     */
    event!.$fetch = globalThis.$fetch
  })
})
