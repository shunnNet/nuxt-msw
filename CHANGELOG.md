
## v1.0.2
[compare changes](https://github.com/shunnNet/nuxt-msw/compare/v1.0.1...v1.0.2)

### 🩹 Fixes
- Lost type infos when `msw.enable: false`([e2bc95b](https://github.com/shunnNet/nuxt-msw/commit/e2bc95b))
  - Related to: [issues/2](https://github.com/shunnNet/nuxt-msw/issues/2). 
  - In previous versions, when `enable: false`, the auto imports provided by `nuxt-msw` would lose type information. This could hinder type checking and potentially cause unnecessary confusion for developers. Therefore, in this update, the auto imports will be retained even when `enable: false` to avoid these issues.

### 🏡 Chore
- Move `ofetch` and `unimport` to dev deps ([0eab2b8](https://github.com/shunnNet/nuxt-msw/commit/0eab2b8))

### ❤️ Contributors

- Net <wendell20904102@gmail.com>

## v1.0.1

## doc
- Makes install instruction more precise.

[compare changes](https://github.com/shunnNet/nuxt-msw/compare/v1.0.0...v1.0.1)

## v1.0.0

[compare changes](https://github.com/shunnNet/nuxt-msw/compare/v0.2.0...v1.0.0)

### 🚀 Enhancements
- Support nuxt-layer and split server and worker context
- Not provide specific version of sw file to prevent compatiblity issue. 
- Support `nuxt/test-utils`

### 🏡 Chore
- Add msw as peerDependencies ([90477ec](https://github.com/shunnNet/nuxt-msw/commit/90477ec))

### ❤️ Contributors
- Net <wendell20904102@gmail.com>


## v0.2.0

[compare changes](https://github.com/shunnNet/nuxt-msw/compare/v0.1.9...v0.2.0)

### 🚀 Changes & Enhancements

- `defineNuxtMswOption` accept function ([b61752f](https://github.com/shunnNet/nuxt-msw/commit/b61752f))
  - Option `handlers` not accept function as value any more.

### ❤️ Contributors

- Net <wendell20904102@gmail.com>

## v0.1.9

[compare changes](https://github.com/shunnNet/nuxt-msw/compare/v0.1.8...v0.1.9)

### 🏡 Chore

- Add build script for preventing public folder be modified by prepack ([fd9b9d6](https://github.com/shunnNet/nuxt-msw/commit/fd9b9d6))

### ❤️ Contributors

- Net <wendell20904102@gmail.com>

## v0.1.8

[compare changes](https://github.com/shunnNet/nuxt-msw/compare/0.1.7...v0.1.8)

### 🏡 Chore

- Update dependencies ([1522d65](https://github.com/shunnNet/nuxt-msw/commit/1522d65))
- Update package info ([b11e3ee](https://github.com/shunnNet/nuxt-msw/commit/b11e3ee))

### ✅ Tests

- Add e2e test ([b96b96f](https://github.com/shunnNet/nuxt-msw/commit/b96b96f))

### ❤️ Contributors

- Net <wendell20904102@gmail.com>

