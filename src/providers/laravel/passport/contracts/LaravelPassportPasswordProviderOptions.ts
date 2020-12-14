import { RefreshSchemeOptions } from 'src/schemes/refresh'
import { ProviderOptions } from 'src/providers'

export interface LaravelPassportPasswordProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelPassportPasswordProviderOptions
