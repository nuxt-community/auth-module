import { resolve, join } from 'path'
import type { Module } from '@nuxt/types'
import defu from 'defu'
import { ModuleOptions, moduleDefaults } from './options'
import { resolveStrategies } from './resolve'

const authModule: Module<ModuleOptions> = function (moduleOptions) {
  // Merge all option sources
  const options: ModuleOptions = defu(
    moduleOptions,
    this.options.auth,
    moduleDefaults
  )

  // Resolve strategies
  const { strategies, strategyScheme } = resolveStrategies(this.nuxt, options)
  delete options.strategies

  // Resolve required imports
  const _uniqueImports = new Set()
  const schemeImports = Object.values(strategyScheme).filter((i) => {
    if (_uniqueImports.has(i.as)) return false
    _uniqueImports.add(i.as)
    return true
  })

  // Set defaultStrategy
  options.defaultStrategy =
    options.defaultStrategy || strategies.length ? strategies[0].name : ''

  // Add plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, '../templates/plugin.js'),
    fileName: join('auth.js'),
    options: {
      options,
      strategies,
      strategyScheme,
      schemeImports
    }
  })

  this.options.plugins.push(resolve(this.options.buildDir, dst))

  // Extend auth with plugins
  if (options.plugins) {
    options.plugins.forEach((p) => this.options.plugins.push(p))
    delete options.plugins
  }

  // Transpile and alias auth src
  const runtime = resolve(__dirname, 'runtime')
  this.options.alias['~auth/runtime'] = runtime
  this.options.build.transpile.push(__dirname)

  // Transpile nanoid (used for oauth2) for IE11 support (#472)
  this.options.build.transpile.push(/^nanoid/)
}

// TODO: Add meta

export default authModule
