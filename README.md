# nuxt-ms
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
- 🥧 Support Nuxt layer.


## Setup
To install the module to your Nuxt application:

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

## Usage
You need to set up the MSW worker and server separately. When either one is set up, that side will start running.
The setup location is in the `~/msw` directory (by default), and you configure it through the corresponding files.

### worker
To set up the worker, you need follow the [MSW documentation](https://mswjs.io/docs/integrations/browser#generating-the-worker-script) to create a worker file. 

Next, you need to create a `worker.{ts|js|mjs|cjs}` file in the `~/msw` directory. The worker file will be run in the Nuxt client plugin, which in browser context. Means you can use browser api and Nuxt composable in this file.

```ts
// ~/msw/worker.ts
import { http, HttpResponse } from 'msw'

export default defineNuxtMswWorkerOption(() => {
  const handlers = [
    // Intercept "GET /api/user" requests...
    http.get('/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        message: "Hello Worker!",
      })
    }),
  ]
  // You can access any browser api
  // window.location.href
  
  return {
    handlers,
    workerOptions: {
      // ...you can pass options to worker.start()
      // onUnhandledRequest: 'bypass',
    },
    onWorkerStarted(worker, nuxtApp) {
      // Module will setup worker when nuxt run client plugin
      // Means this function will be called after plugin call worker.start()

      // nuxtApp.hook('app:mounted', () => {
      //   console.log(worker.listHandlers())
      // })
    },
    
  }
})
```

You can now try to fetch the data from the worker.

```vue
<script setup>

onMounted(async () => {
  const res = await $fetch("/api/user")
  console.log(res) // { message: "Hello Worker!" }
})
</script>
```

----------

### server
The way to set up the server is similar to the worker. You need to create a `server.{ts|js|mjs|cjs}` file in the `~/msw` directory. 

The server file will be run in Node.js `Nitro` context. Because it is before NuxtApp created, you can not access NuxtApp and composable which access it. But you can access msw server and request (h3Event).

One more important thing is that you need to set `baseURL` in the server option if you are using `$fetch` or `useFetch` with no `baseURL` set, and use path with no domain like `/some/path`. The baseURL must be same as your server listening address.
```ts
// ~/msw/server.ts
import { http, HttpResponse } from 'msw'

export default defineNuxtMswServerOption(() => {
  // assume your server listening at http://localhost:3000
  const baseURL = "http://localhost:3000" // or use useRuntimeConfig() to get your baseURL setting

  const handlers = [
    // Intercept "GET http://localhost:3000/user" requests...
    http.get(baseURL + '/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        message: "Hello msw server!"
      })
    }),
  ]
  return {
    baseURL, // baseURL is required when using $fetch or useFetch with no baseURL and relative path
    handlers,
    serverOptions: {
      onUnhandledRequest: 'bypass',
    },

    onRequest(mswServer, h3Event) {
      // This funtion will be call when Nitro server "request" hook
      console.log('Hello from onRequest')
      mswServer.use(/*...*/)
    },
    
  }
})
```

After setting up the server, you can now try to fetch the data from the server.

```vue
<template>
  <h1>{{ data?.message }}</h1> 
  <!-- Hello msw server! -->
</template>
<script setup>
const { data, error } = await useFetch('/api/user')
</script>
```

The `h3Event` has some basic information about the request, such as `event.path`. If you need more, you can explicitly install [`h3`](https://h3.unjs.io/utils/request), and use it to get more.

```ts
import { getQuery } from 'h3'

// ...
{
  // ....
  onRequest(mswServer, h3Event) {
    const query = useQuery(h3Event)
    // do something with query
  }
}

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
      * Path to the nuxt-msw runtime folder that include worker and server files.
      * default: `~/msw`
      */ 
    folderPath: "~/msw"
    
    /**
     * Should include nuxt layers msw settings or not
     * default: true
     */
    includeLayer?: boolean
    
    /**
     *
     * Enable unit test mode. default: false
     *
     * In unit test mode, the module run <folderPath>/unit.{ts,js,mjs,cjs} file which run in nodejs environment.
     *
     * Which means msw server will be used in this mode.
     */
    testUtils?: boolean
  },
})
```

## How to Use in Tests
When performing unit tests with Nuxt, you might use `@nuxt/test-utils` with `vitest`. 

### vitest
If you are only using Vitest without the `@nuxt/test-utils` environment, you will need to manually set up MSW.

Vitest has an [example](https://vitest.dev/guide/mocking#configuration) how to use msw in unit test. 

> [!NOTE]
> In this scenario, if you have handlers set up in the Nuxt layer, you will need to export them for use.

### `@nuxt/test-utils`
Let's talk about unit test part first.

#### Unit Tests
According to the Nuxt official documentation, if you need to test within the Nuxt context (to ensure composables and other features function correctly), you must set up the Nuxt environment.

To ensure that MSW works correctly in this situation, nuxt-msw provides a helper function for environment setup and configuring the MSW server.

First, you need enable `testUtils` option for `nuxt-msw` module. Suggest enable in `vitest.config.ts`.

```ts
// vitest.config.ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  // any custom Vitest config you require
  test: {
    // .....
    environmentOptions: {
      nuxt: {
        domEnvionment: 'happy-dom',
        host: 3000,
        overrides: {
          msw: {
            testUtils: true,
          },
        },
      },
    },
  },
})
```

Then, you can use `setupNuxtMswServer` to setup MSW server in unit test. (Note: can't run in setup files currently. So you need to run it in every test file.)

The component may look like this:

```vue
<script setup lang="ts">
const { data } = await useFetch(
  '/api/user', 
  { baseURL: 'http://localhost:3000' }
)
</script>

<template>
  <div id="name">{{ data.name }}</div>
</template>
```

```ts
// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UserName from './UserName.vue'

import { setupNuxtMswServer } from '@crazydos/nuxt-msw/test-utils'
import { http, HttpResponse } from "msw"

const mswServer = setupNuxtMswServer({
  handlers: [
    http.get(
      'http://localhost:3000/api/user', 
      () => HttpResponse.json({ name: 'msw server unit' })
    })
  ],
  serverOptions: {
    // onUnhandledRequest: 'bypass',
  },
})
afterEach(() => {
  // you can do anything with mswServer
  mswServer.resetHandlers()
})

it('displays message', async () => {
  // replace handler if needed
  // mswServer.use(
  //   http.get('/api/user', () => {
  //     return HttpResponse.json({
  //       name: 'msw server unit replaced',
  //     })
  //   })
  // )
  const component = await mountSuspended(UserName)

  expect(component.find('#name').text()).toBe('msw server unit')
})
```
##### Note: `baseURL` in unit test
If you are using `$fetch` or `useFetch` with no `baseURL` set, and use path with no domain like `/some/path`. You can mock like following:

```ts
// for example
await useFetch('/api/user') 

// mock with baseURL
const baseURL = 'http://localhost:3000'
setupNuxtMswServer({
  baseURL,
  handlers: [
    http.get(baseURL + '/api/user', () => {
      return HttpResponse.json({ name: 'msw server unit' })
    })
  ]
})

```


#### E2E Tests
`@nuxt/test-utils` uses Playwright as the E2E test driver, and it actually runs the Nuxt server and browser in a separate process. This means we can't directly modify mock in test.

To modify mocks in this situation, you need to employ workarounds, such as changing the mocks through  [dynamic mock](https://mswjs.io/docs/best-practices/dynamic-mock-scenarios).

The way nuxt-msw runs in this situation is just like normal Nuxt application. So you can just use the same way to setup MSW server and worker.

```ts
// For example: dynamic mock
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
### Note: `$fetch` and `fetch` in `@nuxt/test-utils/e2e`
`@nuxt/test-utils/e2e` provide `$fetch` and `fetch` to make request to nuxt server in e2e test. `nuxt-msw` will do nothing with these two functions becuase they are outside the Nuxt application. So use them as normal.

```ts
import { $fetch, fetch } from '@nuxt/test-utils/e2e'

const html = await $fetch('/')
```

## Nuxt Layer
(Although I think the simplest way to share handlers is just share the handlers.) There may be some cases your teams want to share msw settings by [Nuxt layer](https://nuxt.com/docs/getting-started/layers). `nuxt-msw` also support this. 

`nuxt-msw` will merge the worker and server configurations at each level. Depending on the configuration options, they will either be merged or overwritten. Below is the behavior of each option:

```ts
// worker and server options
{
  handlers: [] // merge. the higher level take precedence
  
  workerOptions: {} // merge. the higher level take precedence
  serverOptions: {} // merge. the higher level take precedence
  
  baseURL: "" // overwrite. the higher level take precedence
  
  onWorkerStarted: () => {} // merge. the lower level execute first
  onRequest: () => {} // merge. the lower level execute first 
}
```

Here is how `nuxt.config` will be resolved:
```ts
export default defineNuxtConfig({
  msw: {
    includeLayer // overwrite. the higher level take precedence
    enable // overwrite. the higher level take precedence
    testUtils // overwrite. the higher level take precedence 
    folderPath // every layer follow its own folderPath setting
  }
})
```

`folderPath` is the only option that is not merged. Each layer will follow its own `folderPath` setting. For example, if you set `folderPath` to `./msw` but set `~/msw` at the layer user level, nuxt-msw will find msw files in following folders:

- `~/msw`
- `/path-to-layer-folder/msw`

### nuxt layer and unit test
If you need share msw settings in layers for unit test, you can add a file named `unit.{ts|js|mjs|cjs}` in the layer folder (app level also support this file). The merge strategy is same as worker and server file. 

`unit.{ts|js|mjs|cjs}` file will be run in Vitest environment, so you can access in this file. Acctually, a part of work of `setupNuxtMswServer` in unit test is import this file and merge the options.

`setupNuxtMswServer` accept the same options as `defineNuxtMswTestOptions` return. The options of `setupNuxtMswServer` will be merged with the options of `unit.{ts|js|mjs|cjs}` file.  `setupNuxtMswServer` will take highest precedence.

```ts
import { http, HttpResponse } from 'msw'

export default defineNuxtMswTestOptions(() => {
  const handlers = [
    http.get('/api/user', () => {
      // ...and respond to them using this JSON response.
      return HttpResponse.json({
        id: 'Mock01',
        name: 'msw server unit',
      })
    }),
  ]
  return {
    baseURL: 'http://localhost:3000',
    handlers,
    serverOptions: {
      // onUnhandledRequest: 'bypass',
    },
  }
})
```

```ts
// xxx.spec.ts
import { setupNuxtMswServer } from '@crazydos/nuxt-msw/test-utils'
import { http, HttpResponse } from "msw"

const mswServer = setupNuxtMswServer({
  handlers: [
    http.get(
      // TODO: need baseURL ?
      '/api/user', 
      () => HttpResponse.json({ name: 'msw server unit' })
    })
  ],
  serverOptions: {
    // onUnhandledRequest: 'bypass',
  },
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
