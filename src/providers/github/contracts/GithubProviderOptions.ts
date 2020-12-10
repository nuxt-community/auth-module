import ProviderOptions from '../../contracts/ProviderOptions'
import Oauth2SchemeOptions from '../../../schemes/oauth2/contracts/Oauth2SchemeOptions'

export interface GithubProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export default GithubProviderOptions
