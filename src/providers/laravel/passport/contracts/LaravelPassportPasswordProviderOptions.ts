import RefreshSchemeOptions from '../../../../schemes/refresh/contracts/RefreshSchemeOptions'
import { ProviderOptions } from '../../../index'

export interface LaravelPassportPasswordProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelPassportPasswordProviderOptions
