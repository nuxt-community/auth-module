import { LocalSchemeEndpoints, LocalSchemeOptions } from '../../local'
import { HTTPRequest } from '../../../index'
import { RefreshableSchemeOptions } from '../../RefreshableScheme'

export interface RefreshSchemeEndpoints extends LocalSchemeEndpoints {
  refresh: HTTPRequest
}

export interface RefreshSchemeOptions
  extends LocalSchemeOptions,
    RefreshableSchemeOptions {
  endpoints: RefreshSchemeEndpoints
  autoLogout: boolean
}

export default RefreshSchemeOptions
