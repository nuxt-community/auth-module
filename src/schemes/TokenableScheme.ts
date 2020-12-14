import Token from 'src/inc/token'
import RequestHandler from 'src/inc/request-handler'
import { HTTPRequest } from 'src/index'
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
