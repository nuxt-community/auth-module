import { Oauth2SchemeOptions } from 'src/schemes/oauth2'
import { ProviderOptions } from 'src/providers'

export interface Auth0ProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {
  domain: string
}

export default Auth0ProviderOptions
