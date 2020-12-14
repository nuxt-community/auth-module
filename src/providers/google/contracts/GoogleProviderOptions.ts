import Oauth2SchemeOptions from '../../../schemes/oauth2/contracts/Oauth2SchemeOptions'
import { ProviderOptions } from '../../index'

export interface GoogleProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export default GoogleProviderOptions
