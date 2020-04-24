import defu from 'defu'
import { Auth, SchemeOptions } from '../types'

export default class BaseScheme<OptionsT extends SchemeOptions> {
  public options: OptionsT

  constructor (public $auth: Auth, ...options: OptionsT[]) {
    this.options = options.reduce((p, c) => defu(p, c), {})
  }

  get name (): string {
    return this.options.name
  }
}
