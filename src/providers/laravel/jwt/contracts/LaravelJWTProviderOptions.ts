import ProviderOptions from '../../../contracts/ProviderOptions'
import RefreshSchemeOptions from '../../../../schemes/refresh/contracts/RefreshSchemeOptions'

export interface LaravelJWTProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelJWTProviderOptions
