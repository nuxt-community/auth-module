import './types'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import _Auth from './core/auth'

export { AxiosRequestConfig as HTTPRequest }
export { AxiosResponse as HTTPResponse }

/* Auth */
export { _Auth as Auth }

/* Providers */
export * from './providers/index'

/* Schemes */
export * from './schemes/index'

// Scheme
export * from './schemes/Scheme'

// Tokenable
export * from './schemes/TokenableScheme'

// Refreshable
export * from './schemes/RefreshableScheme'

// Local
export * from './schemes/local'

// Refresh
export * from './schemes/refresh'

// Cookie
export * from './schemes/cookie'

// Oauth2
export * from './schemes/oauth2'
