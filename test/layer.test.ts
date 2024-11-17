import { fileURLToPath } from 'node:url'
import { describe, expect, test } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('layer', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/layer', import.meta.url)),
    port: 9999,
    browser: true,
  })
  test('ssr', async () => {
    const html = await $fetch('/')
    expect(html).toContain('msw server')
  })
  test('csr worker', async () => {
    const page = await createPage('/')
    const btn = await page.getByTestId('get-data-button')
    await btn.click()

    expect(await page.getByText('msw worker layer').isVisible()).toBe(true)
  })
})
