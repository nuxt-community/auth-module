import { Oauth2SchemeOptions } from 'src/schemes/oauth2'
import { ProviderOptions } from 'src/providers'

export interface FacebookProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export default FacebookProviderOptions
