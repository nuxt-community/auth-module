import defu from 'defu'
import type { SchemeOptions } from '../types'
import type { Auth } from '../core'

export class BaseScheme<OptionsT extends SchemeOptions> {
  public options: OptionsT

  constructor(public $auth: Auth, ...options: OptionsT[]) {
    this.options = options.reduce((p, c) => defu(p, c), {}) as OptionsT
  }

  get name(): string {
    return this.options.name
  }
}
