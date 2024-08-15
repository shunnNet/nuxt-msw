import type { SetupServer } from 'msw/node'
import { useNuxtApp } from '#app'

/**
 * Get the MSW server instance.
 *
 * @returns The MSW server instance.
 */
export const useMswServer = () => useNuxtApp().$mswServer as SetupServer | undefined
