import { RefreshSchemeOptions } from 'src/schemes/refresh'
import { ProviderOptions } from 'src/providers'

export interface LaravelJWTProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelJWTProviderOptions
