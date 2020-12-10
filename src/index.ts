import Vue from 'vue'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import _Auth from './core/auth'
import _Scheme from './schemes/_scheme'
import Token from './inc/token'
import RefreshToken from './inc/refresh-token'
import RequestHandler from './inc/request-handler'

export { AxiosRequestConfig as HTTPRequest }
export { AxiosResponse as HTTPResponse }

export type Auth = _Auth

export type SchemeOptions = {
  name: string
  [key: string]: any
}

export type SchemeCheck = {
  valid: boolean
  tokenExpired?: boolean
  refreshTokenExpired?: boolean
  idTokenExpired?: boolean
  isRefreshable?: boolean
}

export type Scheme = _Scheme<SchemeOptions | any> & {
  token?: Token
  refreshToken?: RefreshToken
  requestHandler?: RequestHandler
  refreshTokens?: Function
  check?: (checkStatus: boolean) => SchemeCheck
  reset?: Function
}

export type AuthOptions = {
  resetOnError: boolean | Function
  defaultStrategy: string
  watchLoggedIn?: boolean
  rewriteRedirects: boolean
  fullPathRedirect: boolean
  scopeKey: string
  redirect: { [from: string]: string }
}

export type OpenIDConnectConfigurationDocument = {
  /* eslint-disable camelcase */
  issuer?: string
  authorization_endpoint?: string
  token_endpoint?: string
  token_endpoint_auth_methods_supported?: string[]
  token_endpoint_auth_signing_alg_values_supported?: string[]
  userinfo_endpoint?: string
  check_session_iframe?: string
  end_session_endpoint?: string
  jwks_uri?: string
  registration_endpoint?: string
  scopes_supported?: string[]
  response_types_supported?: string[]
  acr_values_supported?: string[]
  response_modes_supported?: string[]
  grant_types_supported?: string[]
  subject_types_supported?: string[]
  userinfo_signing_alg_values_supported?: string[]
  userinfo_encryption_alg_values_supported?: string[]
  userinfo_encryption_enc_values_supported?: string[]
  id_token_signing_alg_values_supported?: string[]
  id_token_encryption_alg_values_supported?: string[]
  id_token_encryption_enc_values_supported?: string[]
  request_object_signing_alg_values_supported?: string[]
  display_values_supported?: string[]
  claim_types_supported?: string[]
  claims_supported?: string[]
  claims_parameter_supported?: boolean
  service_documentation?: string
  ui_locales_supported?: string[]
  /* eslint-enable camelcase */
}

declare module '@nuxt/types' {
  interface Context {
    $auth: Auth
  }
  interface NuxtAppOptions {
    $auth: Auth
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    auth?: true | false | 'guest'
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $auth: Auth
  }
}
