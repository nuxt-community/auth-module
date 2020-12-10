import CookieSchemeOptions from '../../../../schemes/cookie/contracts/CookieSchemeOptions'
import ProviderOptions from '../../../contracts/ProviderOptions'

export interface LaravelSanctumProviderOptions extends CookieSchemeOptions, ProviderOptions {
  url: string
}

export default LaravelSanctumProviderOptions
