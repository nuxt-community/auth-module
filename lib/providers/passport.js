const axios = require('axios')
const bodyParser = require('body-parser')
const { assignDefaults } = require('./_utils')

module.exports = function passport (strategy) {
  assignDefaults(strategy, {
    _scheme: 'oauth2',
    _name: 'passport',
    authorization_endpoint: `${strategy.url}/oauth/authorize`,
    token_endpoint: `${strategy.url}/oauth/token`,
    token_key: 'access_token',
    token_type: 'Bearer',
    response_type: 'code',
    grant_type: 'authorization_code',
    scope: '*'
  })

  // Get client_secret, client_id and token_endpoint
  const clientSecret = strategy.client_secret
  const clientID = strategy.client_id
  const tokenEndpoint = strategy.token_endpoint

  // IMPORTANT: remove client_secret from generated bundle
  delete strategy.client_secret

  // Endpoint
  const endpoint = `/_auth/oauth/${strategy._name}/authorize`
  strategy.access_token_endpoint = endpoint

  // Set response_type to code
  strategy.response_type = 'code'

  // Form parser
  const formMiddleware = bodyParser.urlencoded()

  // Register endpoint
  this.options.serverMiddleware.unshift({
    path: endpoint,
    handler: (req, res, next) => {
      if (req.method !== 'POST') {
        return next()
      }

      formMiddleware(req, res, () => {
        const {
          code,
          redirect_uri: redirectUri = strategy.redirect_uri,
          response_type: responseType = strategy.response_type,
          grant_type: grantType = strategy.grant_type
        } = req.body

        if (!code) {
          return next()
        }

        axios
          .request({
            method: 'post',
            url: tokenEndpoint,
            data: {
              client_id: clientID,
              client_secret: clientSecret,
              grant_type: grantType,
              response_type: responseType,
              redirect_uri: redirectUri,
              code
            },
            headers: {
              Accept: 'application/json'
            }
          })
          .then(response => {
            res.end(JSON.stringify(response.data))
          })
          .catch(error => next(error))
      })
    }
  })
}
