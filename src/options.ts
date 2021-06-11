import type { Strategy } from './types'

export interface ModuleOptions {
  plugins?: Array<string | { src: string; ssr: boolean }>
  ignoreExceptions: boolean
  resetOnError: boolean | ((...args: unknown[]) => boolean)
  defaultStrategy: string
  watchLoggedIn: boolean
  rewriteRedirects: boolean
  fullPathRedirect: boolean
  scopeKey: string
  redirect: 
    | {
        login: string | false
        logout: string | false
        callback: string | false
        home: string | false
      }
    | false
  vuex: {
    namespace: string
  }
  cookie:
    | {
        prefix: string
        options: {
          path: string
          expires?: number | Date
          maxAge?: number
          domain?: string
          secure?: boolean
        }
      }
    | false
  localStorage:
    | {
        prefix: string
      }
    | false
  strategies: {
    [strategy: string]: Strategy
  }
}

export const moduleDefaults: ModuleOptions = {
  //  -- Error handling --

  resetOnError: false,

  ignoreExceptions: false,

  // -- Authorization --

  scopeKey: 'scope',

  // -- Redirects --

  rewriteRedirects: true,

  fullPathRedirect: false,

  watchLoggedIn: true,

  redirect: {
    login: '/login',
    logout: '/',
    home: '/',
    callback: '/login'
  },

  //  -- Vuex Store --

  vuex: {
    namespace: 'auth'
  },

  // -- Cookie Store --

  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  },

  // -- localStorage Store --

  localStorage: {
    prefix: 'auth.'
  },

  // -- Strategies --

  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {}
}
