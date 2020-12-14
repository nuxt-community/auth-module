import { CookieSchemeOptions } from 'src/schemes/cookie'
import { ProviderOptions } from 'src/providers'

export interface LaravelSanctumProviderOptions
  extends ProviderOptions,
    CookieSchemeOptions {
  url: string
}

export default LaravelSanctumProviderOptions
