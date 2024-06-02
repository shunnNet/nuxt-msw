// src/mocks/handlers.js
import { setupWorker } from 'msw/browser'
import { defineNuxtPlugin } from '#app'
import { mswOptions } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  console.log('Start msw workers...')
  const _mswOptions = mswOptions()
  const worker = setupWorker(...(
    typeof _mswOptions.handlers === 'function'
      ? _mswOptions.handlers()
      : _mswOptions.handlers
  ))
  await worker.start(_mswOptions.workerOptions)

  _nuxtApp.provide('mswWorker', worker)
})
