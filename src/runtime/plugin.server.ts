// src/mocks/handlers.js
import { defineNuxtPlugin, useRequestEvent } from '#app'

export default defineNuxtPlugin((_nuxtApp) => {
  if (!import.meta.server) {
    return
  }
  const event = useRequestEvent()
  _nuxtApp.provide('mswServer', event!.context.$mswServer)

  _nuxtApp.hook('app:created', () => {
    event!.$fetch = globalThis.$fetch
  })
})
