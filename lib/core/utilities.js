import jwtDecode, { InvalidTokenError } from 'jwt-decode'

export const isUnset = o => typeof o === 'undefined' || o === null
export const isSet = o => !isUnset(o)

export const isSameURL = (a, b) => a.split('?')[0] === b.split('?')[0]

export const isRelativeURL = u =>
  u && u.length && /^\/[a-zA-Z0-9@\-%_~][/a-zA-Z0-9@\-%_~]*[?]?([^#]*)#?([^#]*)$/.test(u)

export const parseQuery = queryString => {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export const encodeQuery = queryObject => {
  return Object.entries(queryObject)
    .filter(([key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

export const routeOption = (route, key, value) => {
  return route.matched.some(m => {
    if (process.client) {
      // Client
      return Object.values(m.components).some(
        component => component.options && component.options[key] === value
      )
    } else {
      // SSR
      return Object.values(m.components).some(component =>
        Object.values(component._Ctor).some(
          ctor => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

export const getMatchedComponents = (route, matches = false) => {
  return [].concat.apply([], route.matched.map(function (m, index) {
    return Object.keys(m.components).map(function (key) {
      matches && matches.push(index)
      return m.components[key]
    })
  }))
}

export function normalizePath (path = '') {
  // Remove query string
  let result = path.split('?')[0]

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }

  return result
}

export function encodeValue (val) {
  if (typeof val === 'string') {
    return val
  }
  return JSON.stringify(val)
}

export function decodeValue (val) {
  // Try to parse as json
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch (_) { }
  }

  // Return as is
  return val
}

export class ExpiredAuthSessionError extends Error {
  constructor() {
    super('Both token and refresh token have expired. Your request was aborted. ' +
      'You should catch this exception to stop it from surfacing.')
    this.name = 'ExpiredAuthSessionError'
  }
}

export class RefreshController {
  constructor (scheme) {
    this.scheme = scheme
    this._isRefreshing = false
  }

  isRefreshing () {
    return this._isRefreshing
  }

  // Returns a promise which is resolved when refresh is completed
  handleRefresh () {
    if (this._isRefreshing) {
      return this.refreshPromise
    }

    return this._doRefresh()
  }

  _doRefresh () {
    this._isRefreshing = true

    this.refreshPromise = new Promise(async resolve => {
      await this.scheme.refreshTokens()

      this._isRefreshing = false
      resolve()
    })

    return this.refreshPromise
  }
}

const TokenExpirationStatusEnum = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  REFRESH_EXPIRED: 'REFRESH_EXPIRED'
})

export class TokenExpirationStatus {
  constructor(scheme) {
    this.token = scheme.$auth.getToken(scheme.name)
    this.refreshToken = scheme.$auth.getRefreshToken(scheme.name)

    this.status = this._calculateTokenStatus()
  }

  _calculateTokenStatus () {
    const now = Date.now()
    let tokenExpiresAt, refreshTokenExpiresAt

    try {
      tokenExpiresAt = jwtDecode(this.token).exp * 1000
      refreshTokenExpiresAt = jwtDecode(this.refreshToken).exp * 1000
    } catch (error) {
      // If the token is not jwt, we can't decode and refresh it
      if (error instanceof InvalidTokenError) {
        return TokenExpirationStatusEnum.UNKNOWN
      }
      throw error
    }

    // Give us some slack to help the token from expiring between validation and usage
    const timeSlackMillis = 500
    tokenExpiresAt -= timeSlackMillis
    refreshTokenExpiresAt -= timeSlackMillis

    // Token is still valid
    if (now < tokenExpiresAt) {
      this.status = TokenExpirationStatusEnum.VALID
    }

    if (now > refreshTokenExpiresAt) {
      return TokenExpirationStatusEnum.REFRESH_EXPIRED
    }
  }

  unknown() {
    return TokenExpirationStatusEnum.UNKNOWN === this.status
  }

  valid () {
    return TokenExpirationStatusEnum.VALID === this.status
  }

  expired () {
    return TokenExpirationStatusEnum.EXPIRED === this.status
  }

  refreshExpired() {
    return TokenExpirationStatusEnum.REFRESH_EXPIRED === this.status
  }
}
