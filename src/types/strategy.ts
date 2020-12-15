import type { SchemeOptions } from './scheme'
import type { ProviderPartialOptions, ProviderOptions } from './provider'

export interface Strategy extends SchemeOptions {
  provider?: string | ((...args: unknown[]) => unknown)
  scheme: string
  enabled: boolean
  [option: string]: unknown
}

export type StrategyOptions<
  SOptions extends SchemeOptions = SchemeOptions
> = ProviderPartialOptions<ProviderOptions & SOptions>
