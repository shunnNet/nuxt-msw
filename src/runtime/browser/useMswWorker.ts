import type { SetupWorker } from 'msw/browser'
import { useNuxtApp } from '#app'

/**
 * Get the MSW worker instance (only available in browser).
 *
 * @returns The MSW worker instance.
 */
export const useNuxtMswWorker = () => useNuxtApp().$mswWorker as SetupWorker | undefined
