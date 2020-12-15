import { resolve, join } from 'path'
import merge from 'lodash/merge'
import uniq from 'lodash/uniq'
import { Module } from '@nuxt/types'
import { ModuleOptions, moduleDefaults } from './options'
import { resolveStrategies } from './resolve'

export type { ModuleOptions } from './options'

const authModule: Module<ModuleOptions> = function (moduleOptions) {
  // Merge all option sources
  const options: ModuleOptions = merge(
    {},
    moduleDefaults,
    moduleOptions,
    this.options.auth
  )

  // Resolve strategies
  const { strategies, strategyScheme } = resolveStrategies(this.nuxt, options)
  delete options.strategies

  // Set defaultStrategy
  options.defaultStrategy =
    options.defaultStrategy || strategies.length ? strategies[0].name : ''

  // Unique schemes
  const uniqueSchemes: string[] = uniq([...strategyScheme.values()])

  // Add plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, '../../templates/plugin.js'),
    fileName: join('auth.js'),
    options: {
      options,
      strategies,
      uniqueSchemes,
      strategyScheme
    }
  })

  this.options.plugins.push(resolve(this.options.buildDir, dst))

  // Extend auth with plugins
  if (options.plugins) {
    options.plugins.forEach((p) => this.options.plugins.push(p))
    delete options.plugins
  }

  // Transpile and alias auth src
  const srcDir = resolve(__dirname, '..')
  this.options.alias['~auth'] = srcDir
  this.options.build.transpile.push(srcDir)

  // Transpile nanoid (used for oauth2) for IE11 support (#472)
  this.options.build.transpile.push(/^nanoid/)
}

// TODO: Add meta

export default authModule
