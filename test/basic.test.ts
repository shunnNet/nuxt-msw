import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch, createPage } from '@nuxt/test-utils/e2e'

describe('basic', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('msw server')
  })

  it('csr worker', async () => {
    const page = await createPage('/')
    const btn = await page.getByTestId('get-data-button')
    await btn.click()

    expect(await page.getByText('msw worker').isVisible()).toBe(true)
  })

  it('server side $fetch direct handler', async () => {
    const res = await $fetch<{ name: string }>('/api/user-fetch')
    expect(res.name).toBe('msw server')
  })
})
