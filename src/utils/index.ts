export const isUnset = o => typeof o === 'undefined' || o === null
export const isSet = o => !isUnset(o)

export function isSameURL (a, b) {
  return a.split('?')[0].replace(/\/+$/, '') === b.split('?')[0].replace(/\/+$/, '')
}

export function isRelativeURL (u) {
  return u && u.length && /^\/([a-zA-Z0-9@\-%_~][/a-zA-Z0-9@\-%_~]*)?([?][^#]*)?(#[^#]*)?$/.test(u)
}

export function parseQuery (queryString) {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function encodeQuery (queryObject: {[key: string]: string}) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(([key, value]) =>
      encodeURIComponent(key) + (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

interface VueComponent { options: object, _Ctor: VueComponent }
type match = { components: VueComponent[] }
type Route = { matched: match[] }

export function routeOption (route: Route, key, value) {
  return route.matched.some((m) => {
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

export function getMatchedComponents (route: Route, matches = []) {
  return [].concat.apply([], route.matched.map(function (m, index) {
    return Object.keys(m.components).map(function (key) {
      matches.push(index)
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
    } catch (_) {
    }
  }

  // Return as is
  return val
}

/**
 * Get property defined by dot notation in string.
 * Based on  https://github.com/dy/dotprop (MIT)
 *
 * @param  {Object} holder   Target object where to look property up
 * @param  {string} propName Dot notation, like 'this.a.b.c'
 * @return {*}          A property value
 */
export function getProp (holder, propName) {
  if (!propName || !holder) {
    return holder
  }

  if (propName in holder) {
    return holder[propName]
  }

  const propParts = Array.isArray(propName) ? propName : (propName + '').split('.')

  let result = holder
  while (propParts.length && result) {
    result = result[propParts.shift()]
  }

  return result
}

export function getResponseProp (response, prop) {
  if (prop[0] === '.') {
    return getProp(response, prop.substring(1))
  } else {
    return getProp(response.data, prop)
  }
}

// Ie "Bearer " + token
export function addTokenPrefix (token, tokenType) {
  if (!token || !tokenType || token.startsWith(tokenType)) {
    return token
  }

  return tokenType + ' ' + token
}

export function urlJoin (...args) {
  return args.join('/')
    .replace(/[/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')
}

export function cleanObj (obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  }

  return obj
}
