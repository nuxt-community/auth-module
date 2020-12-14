import Oauth2SchemeOptions from 'src/schemes/oauth2/contracts/Oauth2SchemeOptions'
import { ProviderOptions } from 'src/providers'

export interface LaravelPassportProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  url: string
}

export default LaravelPassportProviderOptions
