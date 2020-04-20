import { resolve, join } from 'path'
import merge from 'lodash/merge'
import uniq from 'lodash/uniq'
import defaults from './defaults'
import { resolveStrategies } from './resolve'

export default function (moduleOptions) {
  // Merge all option sources
  const options = merge({}, defaults, moduleOptions, this.options.auth)

  // Resolve strategies
  const { strategies, strategyScheme } = resolveStrategies(this.nuxt, options)
  delete options.strategies

  // Set defaultStrategy
  options.defaultStrategy = options.defaultStrategy || strategies.length ? strategies[0].name : ''

  // Add plugin
  const { dst } = this.addTemplate({
    src: resolve(__dirname, 'plugin.tmpl.js'),
    fileName: join('auth.js'),
    options: {
      options,
      strategies,
      uniqueSchemes: uniq([...strategyScheme.values()]),
      strategyScheme
    }
  })

  this.options.plugins.push(resolve(this.options.buildDir, dst))

  // Extend auth with plugins
  if (options.plugins) {
    options.plugins.forEach(p => this.options.plugins.push(p))
    delete options.plugins
  }

  // Transpile and alias auth src
  const srcDir = resolve(__dirname, '../src')
  this.options.alias['~auth'] = srcDir
  this.options.build.transpile.push(srcDir)

  // Transpile nanoid (used for oauth2) for IE11 support (#472)
  this.options.build.transpile.push(/^nanoid/)
}
