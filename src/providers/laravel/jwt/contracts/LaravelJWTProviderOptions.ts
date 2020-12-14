import RefreshSchemeOptions from '../../../../schemes/refresh/contracts/RefreshSchemeOptions'
import { ProviderOptions } from '../../../index'

export interface LaravelJWTProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelJWTProviderOptions
