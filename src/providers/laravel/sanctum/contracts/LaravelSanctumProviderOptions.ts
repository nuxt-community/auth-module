import { CookieSchemeOptions } from '../../../../schemes/cookie'
import { ProviderOptions } from '../../../index'

export interface LaravelSanctumProviderOptions
  extends ProviderOptions,
    CookieSchemeOptions {
  url: string
}

export default LaravelSanctumProviderOptions
