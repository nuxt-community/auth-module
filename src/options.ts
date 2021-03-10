import type { Strategy } from './types'

export interface ModuleOptions {
  plugins?: string[] | { src: string; ssr: boolean }[]
  ignoreExceptions: boolean
  resetOnError: boolean | ((...args: unknown[]) => boolean)
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
  localStorage: {
    prefix: string
  }
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
