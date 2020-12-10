export interface ModuleOptions {
  resetOnError: boolean | Function
  defaultStrategy: string
  watchLoggedIn: boolean
  rewriteRedirects: boolean
  fullPathRedirect: boolean
  scopeKey: string
  redirect: {
    login: string
    logout: string
    callback: string
    home: string
  }
  vuex: {
    namespace: string
  },
  cookie: {
    prefix: string,
    options: {
      path: string
      expires?: number | Date
      maxAge?: number
      domain?: string
      secure?: boolean
    }
  } | false,
  localStorage: {
    prefix: string
  },
  strategies?: {}
}
