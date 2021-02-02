import type { SchemeOptions } from './scheme'
import type { PartialExcept } from './utils'

export interface ProviderOptions {
  scheme: string
  clientSecret: string | number
}

export type ProviderOptionsKeys = Exclude<keyof ProviderOptions, 'clientSecret'>

export type ProviderPartialOptions<
  Options extends ProviderOptions & SchemeOptions
> = PartialExcept<Options, ProviderOptionsKeys>
