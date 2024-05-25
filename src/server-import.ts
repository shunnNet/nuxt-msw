import {
  useNuxt,
} from '@nuxt/kit'
import type { Import } from 'unimport'

const toArray = (val: string | string[]) => Array.isArray(val) ? val : [val]

export const addServerImports = (imports: Import[]) => {
  const nuxt = useNuxt()
  nuxt.hook('nitro:config', (config) => {
    config.imports = config.imports || {}
    config.imports.imports = config.imports.imports || []
    config.imports.imports.push(...imports)
  })
}
export const addServerImportsDir = (
  dirs: string | string[],
  opts: { prepend?: boolean } = {},
) => {
  const nuxt = useNuxt()
  const _dirs = toArray(dirs)
  nuxt.hook('nitro:config', (config) => {
    config.imports = config.imports || {}
    config.imports.dirs = config.imports.dirs || []
    config.imports.dirs[opts.prepend ? 'unshift' : 'push'](..._dirs)
  })
}
