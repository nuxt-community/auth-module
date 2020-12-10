import ProviderOptions from '../../contracts/ProviderOptions'
import Oauth2SchemeOptions from '../../../schemes/oauth2/contracts/Oauth2SchemeOptions'

export interface Auth0ProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  domain: string
}

export default Auth0ProviderOptions
