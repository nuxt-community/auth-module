import defu from 'defu'
import axios from 'axios'
import bodyParser from 'body-parser'

export function assignDefaults (strategy, defaults) {
  Object.assign(strategy, defu(strategy, defaults))
}

export function addAuthorize (nuxt, strategy) {
  // Get clientSecret, clientId, endpoints.token and audience
  const clientSecret = strategy.clientSecret
  const clientID = strategy.clientId
  const tokenEndpoint = strategy.endpoints.token
  const audience = strategy.audience

  // IMPORTANT: remove clientSecret from generated bundle
  delete strategy.clientSecret

  // Endpoint
  const endpoint = `/_auth/oauth/${strategy._name}/authorize`
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

        axios
          .request({
            method: 'post',
            url: tokenEndpoint,
            data: {
              client_id: clientID,
              client_secret: clientSecret,
              refresh_token: refreshToken,
              grant_type: grantType,
              response_type: responseType,
              redirect_uri: redirectUri,
              audience,
              code
            },
            headers: {
              Accept: 'application/json'
            }
          })
          .then((response) => {
            res.end(JSON.stringify(response.data))
          })
          .catch(error => next(error))
      })
    }
  })
}
