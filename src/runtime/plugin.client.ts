import { setupWorker } from 'msw/browser'
import { defineNuxtPlugin } from '#app'
import { _mswWorkerOptions } from '#imports'

export default defineNuxtPlugin(async (_nuxtApp) => {
  console.log('Start msw workers...')
  const _mswOptions = _mswWorkerOptions()
  const worker = setupWorker(...(
    typeof _mswOptions.handlers === 'function'
      ? _mswOptions.handlers()
      : _mswOptions.handlers
  ))
  await worker.start(_mswOptions.workerOptions)
  _nuxtApp.provide('mswWorker', worker)

  // Run onWorkerStarted
  const onWorkerStarted = _mswOptions.onWorkerStarted
    ? Array.isArray(_mswOptions.onWorkerStarted)
      ? _mswOptions.onWorkerStarted
      : [_mswOptions.onWorkerStarted]
    : []
  try {
    for (const fn of onWorkerStarted) {
      await fn(worker, _nuxtApp)
    }
  }
  catch (e) { console.error(e) }
})
