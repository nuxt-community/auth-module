const { assignDefaults } = require('./_utils')

module.exports = function laravelSanctum (strategy) {
  const { url } = strategy

  if (!url) {
    throw new Error('url is required is laravel sanctum!')
  }

  const endpointDefaults = {
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  const endpoints = {
    csrf: {
      ...endpointDefaults,
      url: url + '/sanctum/csrf-cookie'
    },
    login: {
      ...endpointDefaults,
      url: url + '/login'
    },
    logout: {
      ...endpointDefaults,
      url: url + '/logout'
    },
    user: {
      ...endpointDefaults,
      url: url + '/api/user'
    }
  }

  if (strategy.endpoints) {
    for (const key of Object.keys(strategy.endpoints)) {
      const endpointUrl = strategy.endpoints[key].url

      if (endpointUrl) {
        endpoints[key].url = url + endpointUrl
        delete strategy.endpoints[key].url
      }
    }
  }

  assignDefaults(strategy, {
    _scheme: 'cookie',
    _name: 'laravel.sanctum',
    cookie: {
      name: 'XSRF-TOKEN'
    },
    endpoints,
    user: {
      property: false
    }
  })
}
