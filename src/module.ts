import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve, join } from 'node:path'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addImportsDir,
  resolveAlias,
  addServerPlugin,
  findPath,
} from '@nuxt/kit'
import { addServerImports, addServerImportsDir } from './server-import'
import logger from './logger'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Whether to enable the module. Default to `true`
   */
  enable: boolean
  /**
   * Path to the nuxt-msw runtime folder that include options file.
   * default: `~/msw`
   */
  folderPath?: string
  /**
   * Should include layers msw settings or not
   * default: true
   */
  includeLayer?: boolean

  /**
   * Use auto generated service worker file. You can turn to false when you need enable worker conditionally or merge with other worker.
   * If you turn to false, you need to generate the worker file by yourself.
   * default: true
   */
  // autoServiceWorker?: boolean

  /**
   *
   * Enable unit test mode. default: false
   *
   * In unit test mode, the module run <folderPath>/unit.{ts,js,mjs,cjs} file which run in nodejs environment.
   *
   * Which means msw server will be used in this mode.
   */
  testUtils?: boolean
}
const DEFAULT_OPTION_PATH = '~/msw'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-msw',
    configKey: 'msw',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enable: true,
    includeLayer: true,
    testUtils: false,
    // autoServiceWorker: true,
  },
  async setup(_options, _nuxt) {
    if (_options.enable === false) {
      logger.info('msw disabled because enable: false')
      return
    }

    let _layerFilePaths: string[] = []
    if (_options.includeLayer) {
      _layerFilePaths = _nuxt.options._layers
        .filter(layer => layer.config.msw?.folderPath)
        .map(layer =>
          layer.cwd === _nuxt.options.rootDir
            ? resolveAlias(layer.config.msw!.folderPath!)
            : resolve(layer.cwd, layer.config.msw!.folderPath!),
        )
        .reverse()
    }
    else {
      _layerFilePaths = _nuxt.options._layers
        .filter(layer =>
          layer.cwd === _nuxt.options.rootDir && layer.config.msw?.folderPath,
        )
        .map(layer => resolveAlias(layer.config.msw!.folderPath!))
    }
    if (!_layerFilePaths.length) {
      _layerFilePaths.push(resolveAlias(DEFAULT_OPTION_PATH))
    }
    const layerFilePathsServer = (
      await Promise.all(_layerFilePaths.map(async p => findPath(join(p, 'server'), undefined, 'file')))
    ).filter(Boolean)
    const layerFilePathsWorker = (
      await Promise.all(_layerFilePaths.map(async p => findPath(join(p, 'worker'), undefined, 'file')))
    ).filter(Boolean)

    const layerFilePathsNode = (
      await Promise.all(_layerFilePaths.map(async p => findPath(join(p, 'unit'), undefined, 'file')))
    ).filter(Boolean)

    if (
      !(layerFilePathsServer.length || layerFilePathsWorker.length)
      && !_options.testUtils
    ) {
      logger.warn(`msw disabled because no config file found. Tried to get configs from folders: ${_layerFilePaths}`)
      return
    }

    const resolver = createResolver(import.meta.url)

    // NOTE: The nitro context (which is running at different context to nuxt) can not use "template"
    // So, we need use composable
    // The composable should dynamically import msw options in all nuxt layers, work both server and browser

    const customDefu = `import { createDefu } from "defu"
const customDefu = createDefu((obj, key, value) => {
  if (['onWorkerStarted', 'onRequest', 'afterResponse'].includes(key)) {
      if (typeof obj[key] === "function" && typeof value === "function") {
        obj[key] = [obj[key]].concat(value)
      } else if (Array.isArray(obj[key]) && typeof value === "function") {
        obj[key].push(value)
      } else {
        obj[key] = value
      }
      return true
  }
})
`
    // NOTE: If we don't do this, the "#imports" alias will break
    //  _nuxt.options.build.transpile.push(newComposablePathServer)
    // https://github.com/nuxt/nuxt/issues/21497#issuecomment-1911845046
    // TODO: But why ?

    // support @nuxt/test-utils
    if (_options.testUtils) {
      const composablePathTest = resolver.resolve('./runtime/dynamic/useNuxtMswServerTestOptions.mjs')
      mkdirSync(dirname(composablePathTest), { recursive: true })
      writeFileSync(
        composablePathTest,
        `${layerFilePathsNode.map((p, i) => `import mswOptions${i} from "${p}"`).join('\n')}
    ${customDefu}
    export default () => {
      return [
      ${layerFilePathsNode.map((_, i) => `mswOptions${i}()`).join(',')}
      ].reduce((acc, cur) => customDefu(cur, acc), [])
    }`)
      _nuxt.options.build.transpile.push(composablePathTest)
      addImports([{
        name: 'default',
        as: '_mswTestOptions',
        from: composablePathTest,
      }])
    }
    else {
      if (layerFilePathsServer.length) {
        const newComposablePathServer = resolver.resolve('./runtime/dynamic/useNuxtMswServerOptions.mjs')
        mkdirSync(dirname(newComposablePathServer), { recursive: true })
        writeFileSync(
          newComposablePathServer,
          `${layerFilePathsServer.map((p, i) => `import mswOptions${i} from "${p}"`).join('\n')}
      ${customDefu}
          export default () => {
            return [
            ${layerFilePathsServer.map((_, i) => `mswOptions${i}()`).join(',')}
            ].reduce((acc, cur) => customDefu(cur, acc), [])
          }`)
        _nuxt.options.build.transpile.push(newComposablePathServer)
        addServerImports([{
          name: 'default',
          as: '_mswServerOptions',
          from: newComposablePathServer,
        }])
        addPlugin(resolver.resolve('./runtime/plugin.server'))
        addServerPlugin(resolver.resolve('./runtime/nitro-plugin'))
        addImportsDir(resolver.resolve('./runtime/server'))
      }
      else {
        logger.info('No server file found.')
      }

      if (layerFilePathsWorker.length) {
        const newComposablePathWorker = resolver.resolve('./runtime/dynamic/useNuxtMswWorkerOptions.mjs')
        mkdirSync(dirname(newComposablePathWorker), { recursive: true })
        writeFileSync(
          newComposablePathWorker,
          `${layerFilePathsWorker.map((p, i) => `import mswOptions${i} from "${p}"`).join('\n')}
    ${customDefu}
    export default () => {
      return [
      ${layerFilePathsWorker.map((_, i) => `mswOptions${i}()`).join(',')}
      ].reduce((acc, cur) => customDefu(cur, acc), [])
    }`)
        _nuxt.options.build.transpile.push(newComposablePathWorker)
        addImports([{
          name: 'default',
          as: '_mswWorkerOptions',
          from: newComposablePathWorker,
        }])
        addPlugin({
          src: resolver.resolve('./runtime/plugin.client'),
          mode: 'client',
          order: -50,
        })
        addImportsDir(resolver.resolve('./runtime/browser'))
      }
      else {
        logger.info('No worker file found.')
      }
    }

    const composablesImportPath = resolver.resolve('./runtime/composables')
    addImportsDir(composablesImportPath)
    addServerImportsDir(composablesImportPath)

    // Note: There may have compatiblity issue if provide specific version sw file to user, so let user to generate it by themselves.
    // TODO: Or find a way to auto generate it based on user's msw version.
    // if (_options.autoServiceWorker) {
    //   _nuxt.hook('nitro:config', async (nitroConfig) => {
    //     nitroConfig.publicAssets ||= []
    //     nitroConfig.publicAssets.push({
    //       dir: resolver.resolve('./runtime/public'),
    //       maxAge: 60 * 60 * 24 * 365, // 1 year
    //     })
    //   })
    // }
  },
})
