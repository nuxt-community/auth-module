import _Auth from './core/auth'
import _Scheme from './schemes/_scheme'
import Token from './inc/token'
import RefreshToken from './inc/refresh-token'
import RequestHandler from './inc/request-handler'

export type Auth = _Auth
export type Scheme = _Scheme<SchemeOptions | any> & {
  token?: Token,
  refreshToken?: RefreshToken
  requestHandler?: RequestHandler
  refreshTokens?: Function
  check?: (checkStatus: boolean, tokenCallback?: (isRefreshable: boolean) => boolean | void, refreshTokenCallback?: () => boolean | void) => boolean | Promise<boolean>
  reset?: Function
}

export type SchemeOptions = {
  name: string,
  [key: string]: any
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
    $auth: any;
  }
}
