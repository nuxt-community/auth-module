import { LocalSchemeEndpoints, LocalSchemeOptions } from 'src/schemes/local'
import { HTTPRequest } from 'src/index'
import { RefreshableSchemeOptions } from 'src/schemes/RefreshableScheme'

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
