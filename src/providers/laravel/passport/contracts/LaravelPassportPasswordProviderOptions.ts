import { RefreshSchemeOptions } from '../../../../schemes/refresh'
import { ProviderOptions } from '../../../index'

export interface LaravelPassportPasswordProviderOptions
  extends ProviderOptions,
    RefreshSchemeOptions {
  url: string
}

export default LaravelPassportPasswordProviderOptions
