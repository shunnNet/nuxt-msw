import { setupServer } from 'msw/node'
import { defineNuxtPlugin } from '#app'
import { _mswNodeOptions } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  console.log('Start msw server...')
  const _mswOptions = _mswNodeOptions()
  const server = setupServer(...(
    typeof _mswOptions.handlers === 'function'
      ? _mswOptions.handlers()
      : _mswOptions.handlers
  ))
  await server.listen(_mswOptions.serverOptions)
  _nuxtApp.provide('mswServer', server)
})
