import type { HTTPRequest, HTTPResponse, Auth } from '../types'
import type {
  Token,
  RefreshToken,
  RefreshController,
  RequestHandler
} from '../inc'
import type { PartialExcept } from './utils'

// TODO: Move us to our home
export interface UserOptions {
  property: string | false
  autoFetch: boolean
}
export interface EndpointsOption {
  [endpoint: string]: string | HTTPRequest | false
}

// Scheme

export interface SchemeOptions {
  name: string
}

export type SchemePartialOptions<Options extends SchemeOptions> = PartialExcept<
  Options,
  keyof SchemeOptions
>

export interface SchemeCheck {
  valid: boolean
  tokenExpired?: boolean
  refreshTokenExpired?: boolean
  isRefreshable?: boolean
}
export interface Scheme<OptionsT extends SchemeOptions = SchemeOptions> {
  options: OptionsT
  name?: string
  $auth: Auth
  mounted?(...args: unknown[]): Promise<HTTPResponse | void>
  check?(checkStatus: boolean): SchemeCheck
  login(...args: unknown[]): Promise<HTTPResponse | void>
  fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void>
  setUserToken?(
    token: string | boolean,
    refreshToken?: string | boolean
  ): Promise<HTTPResponse | void>
  logout?(endpoint?: HTTPRequest): Promise<void> | void
  reset?(options?: { resetInterceptor: boolean }): void
}

// Token

export interface TokenOptions {
  property: string
  type: string | false
  name: string
  maxAge: number | false
  global: boolean
  required: boolean
  prefix: string
  expirationPrefix: string
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

// Refrash

export interface RefreshTokenOptions {
  property: string | false
  type: string | false
  data: string | false
  maxAge: number | false
  required: boolean
  tokenRequired: boolean
  prefix: string
  expirationPrefix: string
}

export interface RefreshableSchemeOptions extends TokenableSchemeOptions {
  refreshToken: RefreshTokenOptions
}

export interface RefreshableScheme<
  OptionsT extends RefreshableSchemeOptions = RefreshableSchemeOptions
> extends TokenableScheme<OptionsT> {
  refreshToken: RefreshToken
  refreshController: RefreshController
  refreshTokens(): Promise<HTTPResponse | void>
}
