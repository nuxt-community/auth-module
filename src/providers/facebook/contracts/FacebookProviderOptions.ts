import ProviderOptions from '../../contracts/ProviderOptions'
import Oauth2SchemeOptions from '../../../schemes/oauth2/contracts/Oauth2SchemeOptions'

export interface FacebookProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export default FacebookProviderOptions
