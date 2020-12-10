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
