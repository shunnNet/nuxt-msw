import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addImportsDir,
  resolveAlias,
  addServerPlugin,
} from '@nuxt/kit'
import { addServerImports, addServerImportsDir } from './server-import'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Whether to enable the module
   */
  enable: boolean
  /**
   * Path to the nuxt-msw runtime options file.
   * default: `~/msw/index`
   */
  optionPath: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-msw',
    configKey: 'msw',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    enable: true,
    optionPath: '~/msw/index',
  },
  setup(_options, _nuxt) {
    if (_options.enable === false) {
      return
    }

    const resolver = createResolver(import.meta.url)
    const composablesImportPath = resolver.resolve('./runtime/composables')
    const optionsImport = {
      name: 'default',
      as: 'mswOptions',
      from: resolveAlias(_options.optionPath),
    }
    addImportsDir(composablesImportPath)
    addServerImportsDir(composablesImportPath)

    addImports([optionsImport])
    addServerImports([optionsImport])

    addPlugin(resolver.resolve('./runtime/plugin.server'))
    addPlugin({
      src: resolver.resolve('./runtime/plugin.client'),
      mode: 'client',
      order: -50,
    })
    addServerPlugin(resolver.resolve('./runtime/nitro-plugin'))

    _nuxt.hook('nitro:config', async (nitroConfig) => {
      nitroConfig.publicAssets ||= []
      nitroConfig.publicAssets.push({
        dir: resolver.resolve('./runtime/public'),
        maxAge: 60 * 60 * 24 * 365, // 1 year
      })
    })
  },
})
