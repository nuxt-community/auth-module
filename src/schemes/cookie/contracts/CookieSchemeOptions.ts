import { LocalSchemeEndpoints, LocalSchemeOptions } from 'src/schemes/local'
import { HTTPRequest } from 'src/index'

export interface CookieSchemeEndpoints extends LocalSchemeEndpoints {
  csrf: HTTPRequest
}

export interface CookieSchemeCookie {
  name: string
}

export interface CookieSchemeOptions extends LocalSchemeOptions {
  endpoints: CookieSchemeEndpoints
  cookie: CookieSchemeCookie
}

export default CookieSchemeOptions
