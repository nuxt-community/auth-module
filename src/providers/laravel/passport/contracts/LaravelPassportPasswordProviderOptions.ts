import ProviderOptions from '../../../contracts/ProviderOptions'
import RefreshSchemeOptions from '../../../../schemes/refresh/contracts/RefreshSchemeOptions'

export interface LaravelPassportPasswordProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelPassportPasswordProviderOptions
