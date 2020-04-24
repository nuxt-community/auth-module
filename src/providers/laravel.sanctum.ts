import { assignDefaults, assignAbsoluteEndpoints } from './_utils'

export function laravelSanctum (_nuxt, strategy) {
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

  assignDefaults(strategy, {
    scheme: 'cookie',
    name: 'laravel.sanctum',
    cookie: {
      name: 'XSRF-TOKEN'
    },
    endpoints: {
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
    },
    user: {
      property: false
    }
  })

  assignAbsoluteEndpoints(strategy)
}
