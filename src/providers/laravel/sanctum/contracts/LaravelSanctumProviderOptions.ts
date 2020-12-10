import CookieSchemeOptions from '../../../../schemes/cookie/contracts/CookieSchemeOptions'
import ProviderOptions from '../../../contracts/ProviderOptions'

export interface LaravelSanctumProviderOptions
  extends ProviderOptions,
    CookieSchemeOptions {
  url: string
}

export default LaravelSanctumProviderOptions
