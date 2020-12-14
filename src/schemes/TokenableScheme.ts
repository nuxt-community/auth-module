import Token from '../inc/token'
import RequestHandler from '../inc/request-handler'
import { HTTPRequest } from '../index'
import Scheme from './Scheme'
import { TokenOptions, SchemeOptions } from './index'

export interface EndpointsOption {
  [endpoint: string]: string | HTTPRequest | false
}

export interface TokenableSchemeOptions extends SchemeOptions {
  token: TokenOptions
  endpoints: EndpointsOption
}

export interface TokenableScheme<
  OptionsT extends TokenableSchemeOptions = TokenableSchemeOptions
> extends Scheme<OptionsT> {
  token: Token
  requestHandler: RequestHandler
}

export default TokenableScheme
