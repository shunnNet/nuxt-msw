// src/mocks/handlers.js
import { setupWorker } from 'msw/browser'
import { defineNuxtPlugin } from '#app'
import { mswOptions } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  console.log('Start msw workers...')
  const worker = setupWorker(...(
    typeof mswOptions.handlers === 'function'
      ? mswOptions.handlers()
      : mswOptions.handlers
  ))
  console.log(worker.listHandlers())
  await worker.start(mswOptions.workerOptions)

  _nuxtApp.provide('mswWorker', worker)
})
