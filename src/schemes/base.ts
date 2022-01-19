import defu from 'defu'
import type { SchemeOptions } from '../types'
import type { Auth } from '../core'

export class BaseScheme<OptionsT extends SchemeOptions> {
  public options: OptionsT

  constructor(public $auth: Auth, ...options: OptionsT[]) {
    const confDefu = defu.extend((obj, k, v) => {
      if (Array.isArray(obj[k]) && Array.isArray(v)) {
        obj[k] = v
        return true
      }
    })
    this.options = options.reduce((p, c) => confDefu(p, c), {}) as OptionsT
  }

  get name(): string {
    return this.options.name
  }
}
