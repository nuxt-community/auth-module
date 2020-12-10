import { HTTPRequest } from '../../../index'
import { UserOptions } from '../../contracts/SchemeOptions'
import { EndpointsOption, TokenableSchemeOptions } from '../../TokenableScheme'

export interface LocalSchemeEndpoints extends EndpointsOption {
  login: HTTPRequest | false
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
