# nuxt-msw
<!-- [![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href] -->

`nuxt-msw` integrates [MSW (Mock Service Worker)](https://mswjs.io/) into a Nuxt project, allowing you to use it for API mocking during development. Most of the code can be directly shared with test mocks, making it a great tool for mocking. 

> [!WARNING] 
> (Please kindly check the [usage for unit-test](#about-usage-for-unit-test-sadly) and [usage for e2e-test](#about-usage-for-e2e-test-very-sadly) section before trying to use this module.) 


- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/nuxt-msw?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- 🌲 Use MSW powerful mocking features in Nuxt development

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

// Assuming your nuxt serve at localhost:3000 
const baseURL = 'http://localhost:3000'

export default defineNuxtMswOption({
  baseURL,
  
  // Handlers will be applied to BOTH server and worker.
  // You can use 'array of handlers', or 'function return array of handlers' for conditional case (e.g: different handler between server and worker)
  handlers: () => {
    return [
      // Intercept "GET http://localhost:3000/api/user" requests...
      http.get(
        (import.meta.server ? baseURL : '') + '/api/user', () => {
        // ...and respond to them using this JSON response.
        return HttpResponse.json({
          id: 'testid',
          firstName: 'John',
          lastName: 'Maverick',
        })
      }),
    ]
  },
  workerOptions: {
    // ... pass options to worker.start()
  },
  serverOptions: {
    // ... pass options to server.listen()
  },
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
When performing unit tests in Nuxt, you might use `@nuxt/test-utils`, `vitest` or `jest`. If you still wish to use MSW for mocking, you need to disable `nuxt-msw` to avoid compatibility issues. 

**This means you need to manually manage the MSW server when setting up unit tests.** Of course, you can still use the handlers from `nuxt-msw` by importing them.

```ts
export default defineNuxtConfig({
  modules: ['@crazydos/nuxt-msw'],
  msw: {
    enable: process.env.ENABLE_MSW, // to false when unit test
  },
})
```

## About usage for e2e-test
If you want to perform e2e tests on Nuxt, you might use `@nuxt/test-utils`, `Playwright`, or `Cypress`. Unfortunately, although nuxt-msw can run smoothly, you won't be able to replace the mock handler because the e2e runner and the running Nuxt instance use different memory spaces. 

Therefore, if you want to replace mock handler when e2e test for different test case, you need to find an alternative solution for integrating MSW with your e2e framework (such as [playwright-msw](https://github.com/valendres/playwright-msw)). 

Using the mocking features provided by `@nuxt/test-utils` is also a good option.

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
