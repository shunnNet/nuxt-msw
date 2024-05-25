import { expect, test } from '@nuxt/test-utils/playwright'

test('normal mock', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByText('John')).toBeVisible()
})
test('test dynamic mock', async ({ page, goto }) => {
  await goto('/?alternative=true', { waitUntil: 'hydration' })
  await page.getByTestId('get-data-button').click()
  await expect(page.getByText('Jane')).toBeVisible()
})
