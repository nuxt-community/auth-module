import { PartialExcept } from '../types/utils'
import { SchemeOptions } from '../schemes'

export interface ProviderOptions {
  scheme: string
  clientSecret: string | number
}

type ProviderOptionsKeys = Exclude<keyof ProviderOptions, 'clientSecret'>

export type ProviderPartialOptions<
  Options extends ProviderOptions & SchemeOptions
> = PartialExcept<Options, ProviderOptionsKeys>
