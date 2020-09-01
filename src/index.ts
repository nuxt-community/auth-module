import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import _Auth from './core/auth'
import _Scheme from './schemes/_scheme'
import Token from './inc/token'
import RefreshToken from './inc/refresh-token'
import RequestHandler from './inc/request-handler'
import Vue from 'vue'

export { AxiosRequestConfig as HTTPRequest }
export { AxiosResponse as HTTPResponse }

export type Auth = _Auth
export type Scheme = _Scheme<SchemeOptions | any> & {
  token?: Token,
  refreshToken?: RefreshToken
  requestHandler?: RequestHandler
  refreshTokens?: Function
  check?: (checkStatus: boolean) => SchemeCheck
  reset?: Function
}

export type SchemeOptions = {
  name: string,
  [key: string]: any
}

export type SchemeCheck = {
  valid: boolean
  tokenExpired?: boolean
  refreshTokenExpired?: boolean
  isRefreshable?: boolean
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
    $auth: Auth;
  }
  interface NuxtAppOptions {
    $auth: Auth;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    auth?: true | false | 'guest';
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $auth: Auth;
  }
}
