# nuxt-msw
<!-- [![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href] -->

`nuxt-msw` integrates [MSW (Mock Service Worker)](https://mswjs.io/) into a Nuxt project, allowing you to use it for API mocking during development. Most of the code can be directly shared with test mocks. 


- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-msw?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- 🌲 Write once, use everywhere
- 🚀 Use MSW powerful mocking features in Nuxt development
- ⛰ Intercept both server-side and client-side request, including `$fetch`, `useFetch` and any other api requests.
- 🚠 Auto adding service worker file `mockServiceWorker.js` when module enabled. 


## Setup && Usage

### 1. Install the module to your Nuxt application:

```bash
npm install @crazydos/nuxt-msw msw
```

```ts
export default defineNuxtConfig({
  modules: ['@crazydos/nuxt-msw'],
  msw : {
    // Options, see below
  }
})
```

### 2. Add `~/msw/index.ts` file
```ts
// ~/msw/index.ts
import { http, HttpResponse } from 'msw'

// These configs will be applied to BOTH server and worker. 
export default defineNuxtMswOption(() => {
  const baseURL = useRuntimeConfig().public.msw?.baseURL

  // You can define different handlers between server and client
  const handlers = [
    // Intercept "GET ${baseURL}/api/user" requests...
    http.get((import.meta.server ? baseURL : '') + '/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        id: 'Mock01',
        firstName: 'Mock',
        lastName: 'User',
      })
    }),
  ]
  return {
    baseURL, // Required when using `$fetch` or `useFetch` with no `baseURL` and relative path 
    handlers,
    workerOptions: {
      // ... pass options to worker.start()
    },
    serverOptions: {
      // ... pass options to server.listen()
    }, 
  }
})
```

### 3. Make a request
```vue

<script setup>
const { data, error } = await useFetch('/api/user')
/** The response should be
 * {
    id: 'testid',
    firstName: 'John',
    lastName: 'Maverick',
  }
 */
</script>
```

## Note: baseURL
The `baseURL` is required when using `$fetch` or `useFetch` with no `baseURL` and relative path.

For example:

```ts
await useFetch("/api/user")
```

If your server listening on `http://localhost:3000`, you need set baseURL as `http://localhost:3000`.

## Module options
The option usage could be found at following.

> [!NOTE]  
> It is important to understand that these options is build time config. So if you use environment variable like `.env` to decide these options, you need setup `.env` at `nuxi build` too.

```ts
export default defineNuxtConfig({
  modules: ['@crazydos/nuxt-msw'],
  msw: {
    /**
     * Whether to enable the module. Default to `true`
     */
    enable: true,
    /**
     * Path to the nuxt-msw runtime options file.
     * default: `~/msw/index`
     */
    optionPath: "~/msw/index"
  },
})
```

## About usage for unit-test
When performing unit tests with Nuxt, you might use `@nuxt/test-utils`, `vitest` or `jest`. If you still wish to use MSW for mocking, you need to disable `nuxt-msw` to avoid compatibility issues. 

**This means you need to manually manage the MSW server when setting up unit tests.** Of course, you can still use the handlers from `nuxt-msw` by importing them.

```ts
export default defineNuxtConfig({
  modules: ['@crazydos/nuxt-msw'],
  msw: {
    enable: process.env.ENABLE_MSW, // to false when unit test
  },
})
```

Vitest has an [example](https://vitest.dev/guide/mocking#configuration) how to use msw in unit test. 

## About usage for e2e-test
For e2e test, you can do [dynamic mock](https://mswjs.io/docs/best-practices/dynamic-mock-scenarios) at client-side. The server-side dynamic mock is not available currently.

Here is a example with `@nuxt/test-utils`:
```ts
// ~/msw/index.ts
import { http, HttpResponse } from 'msw'

export default defineNuxtMswOption(() => {
  const baseURL = useRuntimeConfig().public.msw?.baseURL
  // 1. Handlers for server-side and client-side
  const handlers = [
    http.get((import.meta.server ? baseURL : '') + '/api/user', () => {
      return HttpResponse.json({
        id: 'Mock01',
        firstName: 'Mock',
        lastName: 'User',
      })
    }),
  ]
 
  // 2. Dynamic mock by searchParams
  // Change mock response when fetch from client side
  if (import.meta.client) {
    const url = new URL(window.location.href)

    const alternative = url.searchParams.get('alternative')
    if (alternative === 'true') {
      handlers.unshift(
        // Mock same api endpoint
        http.get('/api/user', () => {
          return HttpResponse.json({
            id: 'Mock02',
            firstName: 'Mock',
            lastName: 'USer 22',
          })
        }),
      )
    }

  }
  return {
    baseURL,
    handlers,
  }
})
```

Then access the page with different url:

```ts
// Normal test case
test('normal mock', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByText('John')).toBeVisible()
})

// Alternative test case
test('test dynamic mock', async ({ page, goto }) => {
  // The server response still the same
  await goto('/?alternative=true', { waitUntil: 'hydration' })

  // Next, we click a button that make a request from client side
  await page.getByTestId('get-data-button').click()

  // We get a different response from same api endpoints
  await expect(page.getByText('Jane')).toBeVisible()
})
```

## Contribution

<details>
  <summary>Local development</summary>
  
  ```bash
  # Install dependencies
  pnpm install
  
  # Generate type stubs
  pnpm dev:prepare
  
  # Develop with the playground
  pnpm dev
  
  # Build the playground
  pnpm dev:build
  
  # Run ESLint
  pnpm lint
  
  ```

</details>

Learn more about [authoring nuxt module](https://nuxt.com/docs/guide/going-further/modules#module-anatomy)


<!-- Badges -->
<!-- [npm-version-src]: https://img.shields.io/npm/v/nuxt-msw/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/nuxt-msw

[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-msw.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npmjs.com/package/nuxt-msw

[license-src]: https://img.shields.io/npm/l/nuxt-msw.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/nuxt-msw

[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com -->
