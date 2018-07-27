const axios = require('axios')
const bodyParser = require('body-parser')

function assignDefaults (strategy, defaults) {
  Object.assign(strategy, Object.assign({}, defaults, strategy))
}

function addAuthorize (strategy) {
  // Get client_secret, client_id and token_endpoint
  const {
    client_id,
    client_secret,
    token_endpoint: tokenEndpoint
  } = strategy

  // IMPORTANT: remove client_secret from generated bundle
  delete strategy.client_secret

  if (strategy.access_token_endpoint) {
    return
  }

  // Endpoint
  const endpoint = `/_auth/oauth/${strategy._name}/authorize`
  strategy.access_token_endpoint = endpoint

  // Set response_type to code
  strategy.response_type = 'code'

  // Form data parser
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
          redirect_uri = strategy.redirect_uri,
          response_type = strategy.response_type,
          grant_type = strategy.grant_type
        } = req.body

        if (!code) {
          return next()
        }

        let data = {
          response_type,
          grant_type,
          redirect_uri,
          code
        }

        let options = {
          headers: {
            Accept: 'application/json'
          }
        }

        if (strategy.tokenParams) {
          options.params = data
          data = {}
        } else {
          Object.assign(data, {
            client_id,
            client_secret
          })
        }

        if (strategy.authHeader) {
          options.auth = {
            username: client_id,
            password: client_secret
          }
        }

        axios
          .post(tokenEndpoint, data, options)
          .then(response => {
            res.end(JSON.stringify(response.data))
          })
          .catch(error => next(error))
      })
    }
  })
}

module.exports = {
  addAuthorize,
  assignDefaults
}
