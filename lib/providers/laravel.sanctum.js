const { assignDefaults } = require('./_utils')

module.exports = function laravelSanctum (strategy) {
  const { laravelBaseURL } = strategy

  if (!laravelBaseURL) {
    throw new Error('laravelBaseURL is required!')
  }

  const endpointDefaults = {
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  assignDefaults(strategy, {
    _scheme: 'cookie',
    _name: 'laravel.sanctum',
    endpoints: {
      csrf: {
        ...endpointDefaults,
        url: laravelBaseURL + '/sanctum/csrf-cookie'
      },
      login: {
        ...endpointDefaults,
        url: laravelBaseURL + '/login'
      },
      logout: {
        ...endpointDefaults,
        url: laravelBaseURL + '/logout'
      },
      user: {
        ...endpointDefaults,
        url: laravelBaseURL + '/api/user'
      }
    },
    user: {
      property: false
    }
  })
}
