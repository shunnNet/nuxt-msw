import type { SetupWorker } from 'msw/browser'
import { useNuxtApp } from '#app'

/**
 * Get the MSW worker instance.
 *
 * @returns The MSW worker instance.
 */
export const useMswWorker = () => useNuxtApp().$mswWorker as SetupWorker | undefined
