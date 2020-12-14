import { HTTPRequest } from 'src/index'
import { UserOptions } from 'src/schemes'
import {
  EndpointsOption,
  TokenableSchemeOptions
} from 'src/schemes/TokenableScheme'

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
