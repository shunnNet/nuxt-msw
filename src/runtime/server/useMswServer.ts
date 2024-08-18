import type { SetupServer } from 'msw/node'
import { useNuxtApp } from '#app'

/**
 * Get the MSW server instance (only available in server side after Nuxt app server plugin initailized).
 *
 * This composable can also be used in unit test with nuxt/test-utils.
 *
 * @returns The MSW server instance.
 */
export const useNuxtMswServer = () => useNuxtApp().$mswServer as SetupServer | undefined
