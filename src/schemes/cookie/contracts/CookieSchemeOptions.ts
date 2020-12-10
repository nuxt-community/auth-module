import {
  LocalSchemeEndpoints,
  LocalSchemeOptions
} from '../../local/contracts/LocalSchemeOptions'
import { HTTPRequest } from '../../../index'

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
