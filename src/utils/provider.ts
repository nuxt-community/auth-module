import qs from 'querystring'
import defu from 'defu'
import axios from 'axios'
import bodyParser from 'body-parser'
import requrl from 'requrl'
import type { StrategyOptions, HTTPRequest } from '../types'
import type {
  Oauth2SchemeOptions,
  RefreshSchemeOptions,
  LocalSchemeOptions
} from '../schemes'

export function assignDefaults<SOptions extends StrategyOptions>(
  strategy: SOptions,
  defaults: SOptions
): void {
  Object.assign(strategy, defu(strategy, defaults))
}

export function addAuthorize<
  SOptions extends StrategyOptions<Oauth2SchemeOptions>
>(
  nuxt: any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  strategy: SOptions,
  useForms: boolean = false
): void {
  // Get clientSecret, clientId, endpoints.token and audience
  const clientSecret = strategy.clientSecret
  const clientID = strategy.clientId
  const tokenEndpoint = strategy.endpoints.token
  const audience = strategy.audience

  // IMPORTANT: remove clientSecret from generated bundle
  delete strategy.clientSecret

  // Endpoint
  const endpoint = `/_auth/oauth/${strategy.name}/authorize`
  strategy.endpoints.token = endpoint

  // Set response_type to code
  strategy.responseType = 'code'

  // Form data parser
  const formMiddleware = bodyParser.urlencoded({ extended: true })

  // Register endpoint
  nuxt.options.serverMiddleware.unshift({
    path: endpoint,
    handler: (req, res, next) => {
      if (req.method !== 'POST') {
        return next()
      }

      formMiddleware(req, res, () => {
        const {
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri = strategy.redirectUri,
          response_type: responseType = strategy.responseType,
          grant_type: grantType = strategy.grantType,
          refresh_token: refreshToken
        } = req.body

        // Grant type is authorization code, but code is not available
        if (grantType === 'authorization_code' && !code) {
          return next()
        }

        // Grant type is refresh token, but refresh token is not available
        if (grantType === 'refresh_token' && !refreshToken) {
          return next()
        }

        let data: qs.ParsedUrlQueryInput | string = {
          client_id: clientID,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: grantType,
          response_type: responseType,
          redirect_uri: redirectUri,
          audience,
          code_verifier: codeVerifier,
          code
        }

        const headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }

        if (useForms) {
          data = qs.stringify(data)
          headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }

        axios
          .request({
            method: 'post',
            url: tokenEndpoint,
            data,
            headers
          })
          .then((response) => {
            res.end(JSON.stringify(response.data))
          })
          .catch((error) => {
            res.statusCode = error.response.status
            res.end(JSON.stringify(error.response.data))
          })
      })
    }
  })
}

export function initializePasswordGrantFlow<
  SOptions extends StrategyOptions<RefreshSchemeOptions>
>(
  nuxt: any, // eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  strategy: SOptions
): void {
  // Get clientSecret, clientId, endpoints.login.url
  const clientSecret = strategy.clientSecret
  const clientId = strategy.clientId
  const tokenEndpoint = strategy.endpoints.token as string

  // IMPORTANT: remove clientSecret from generated bundle
  delete strategy.clientSecret

  // Endpoint
  const endpoint = `/_auth/${strategy.name}/token`
  strategy.endpoints.login.url = endpoint
  strategy.endpoints.refresh.url = endpoint

  // Form data parser
  const formMiddleware = bodyParser.json()

  // Register endpoint
  nuxt.options.serverMiddleware.unshift({
    path: endpoint,
    handler: (req, res, next) => {
      if (req.method !== 'POST') {
        return next()
      }

      formMiddleware(req, res, () => {
        const data = req.body

        // If `grant_type` is not defined, set default value
        if (!data.grant_type) {
          data.grant_type = strategy.grantType
        }

        // If `client_id` is not defined, set default value
        if (!data.client_id) {
          data.grant_type = clientId
        }

        // Grant type is password, but username or password is not available
        if (
          data.grant_type === 'password' &&
          (!data.username || !data.password)
        ) {
          return next(new Error('Invalid username or password'))
        }

        // Grant type is refresh token, but refresh token is not available
        if (data.grant_type === 'refresh_token' && !data.refresh_token) {
          return next(new Error('Refresh token not provided'))
        }

        axios
          .request({
            method: 'post',
            url: tokenEndpoint,
            baseURL: requrl(req),
            data: {
              client_id: clientId,
              client_secret: clientSecret,
              ...data
            },
            headers: {
              Accept: 'application/json'
            }
          })
          .then((response) => {
            res.end(JSON.stringify(response.data))
          })
          .catch((error) => {
            res.statusCode = error.response.status
            res.end(JSON.stringify(error.response.data))
          })
      })
    }
  })
}

export function assignAbsoluteEndpoints<
  SOptions extends StrategyOptions<
    (LocalSchemeOptions | Oauth2SchemeOptions) & { url: string }
  >
>(strategy: SOptions): void {
  const { url, endpoints } = strategy

  if (endpoints) {
    for (const key of Object.keys(endpoints)) {
      const endpoint = endpoints[key]

      if (endpoint) {
        if (typeof endpoint === 'object') {
          if (!endpoint.url || endpoint.url.startsWith(url)) {
            continue
          }
          ;(endpoints[key] as HTTPRequest).url = url + endpoint.url
        } else {
          if (endpoint.startsWith(url)) {
            continue
          }
          endpoints[key] = url + endpoint
        }
      }
    }
  }
}
