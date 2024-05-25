import type { SetupWorker } from 'msw/browser'
import type { SetupServer } from 'msw/node'
import { useNuxtApp } from '#app'

/**
 * Get the MSW server instance.
 *
 * @returns The MSW server instance.
 */
export const useMswServer = () => useNuxtApp().$mswServer as SetupWorker | undefined

/**
 * Get the MSW worker instance.
 *
 * @returns The MSW worker instance.
 */
export const useMswWorker = () => useNuxtApp().$mswWorker as SetupServer | undefined
