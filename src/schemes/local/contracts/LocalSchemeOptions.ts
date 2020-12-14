import { HTTPRequest } from '../../../index'
import { EndpointsOption, TokenableSchemeOptions } from '../../TokenableScheme'
import { UserOptions } from '../../index'

export interface LocalSchemeEndpoints extends EndpointsOption {
  login: HTTPRequest
  logout: HTTPRequest | false
  user: HTTPRequest | false
}

export interface LocalSchemeOptions extends TokenableSchemeOptions {
  endpoints: LocalSchemeEndpoints
  user: UserOptions
  clientId: string | false
  grantType: string | false
  scope: string[] | false
}

export default LocalSchemeOptions
