import ProviderOptions from '../../../contracts/ProviderOptions'
import Oauth2SchemeOptions from '../../../../schemes/oauth2/contracts/Oauth2SchemeOptions'

export interface LaravelPassportProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  url: string
}

export default LaravelPassportProviderOptions
