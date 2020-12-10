import {
  assignDefaults,
  assignAbsoluteEndpoints
} from '../../../utils/provider'
import ProviderPartialOptions from '../../contracts/ProviderPartialOptions'
import { HTTPRequest } from '../../../index'
import LaravelSanctumProviderOptions from './contracts/LaravelSanctumProviderOptions'

export default function laravelSanctum(
  _nuxt,
  strategy: ProviderPartialOptions<LaravelSanctumProviderOptions>
) {
  const { url } = strategy

  if (!url) {
    throw new Error('URL is required with Laravel Sanctum!')
  }

  const endpointDefaults: Partial<HTTPRequest> = {
    withCredentials: true,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  const DEFAULTS: ProviderPartialOptions<LaravelSanctumProviderOptions> = {
    scheme: 'cookie',
    name: 'laravelSanctum',
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
  }

  assignDefaults(strategy, DEFAULTS)

  assignAbsoluteEndpoints(strategy)
}
