import { RecursivePartial } from '../types/utils'
import { HTTPResponse } from '../index'
import Route from './contracts/Router'

export const isUnset = (o: unknown): boolean =>
  typeof o === 'undefined' || o === null
export const isSet = (o: unknown): boolean => !isUnset(o)

export function isSameURL(a: string, b: string): boolean {
  return (
    a.split('?')[0].replace(/\/+$/, '') === b.split('?')[0].replace(/\/+$/, '')
  )
}

export function isRelativeURL(u: string): boolean {
  return (
    u &&
    u.length &&
    /^\/([a-zA-Z0-9@\-%_~][/a-zA-Z0-9@\-%_~]*)?([?][^#]*)?(#[^#]*)?$/.test(u)
  )
}

export function parseQuery(queryString: string): Record<string, unknown> {
  const query = {}
  const pairs = queryString.split('&')
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=')
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
  }
  return query
}

export function encodeQuery(queryObject: {
  [key: string]: string | number | boolean
}): string {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}

export function routeOption(
  route: Route,
  key: string,
  value: string | boolean
): boolean {
  return route.matched.some((m) => {
    if (process.client) {
      // Client
      return Object.values(m.components).some(
        (component) => component.options && component.options[key] === value
      )
    } else {
      // SSR
      return Object.values(m.components).some((component) =>
        Object.values(component._Ctor).some(
          (ctor) => ctor.options && ctor.options[key] === value
        )
      )
    }
  })
}

export function getMatchedComponents(
  route: Route,
  matches: unknown[] = []
): unknown[] {
  return [].concat(
    ...[],
    ...route.matched.map(function (m, index) {
      return Object.keys(m.components).map(function (key) {
        matches.push(index)
        return m.components[key]
      })
    })
  )
}

export function normalizePath(path = ''): string {
  // Remove query string
  let result = path.split('?')[0]

  // Remove redundant / from the end of path
  if (result.charAt(result.length - 1) === '/') {
    result = result.slice(0, -1)
  }

  return result
}

export function encodeValue(val: unknown): string {
  if (typeof val === 'string') {
    return val
  }
  return JSON.stringify(val)
}

export function decodeValue(val: unknown): unknown {
  // Try to parse as json
  if (typeof val === 'string') {
    try {
      return JSON.parse(val)
    } catch (_) {}
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
export function getProp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  holder: Record<string, any>,
  propName: string
): unknown {
  if (!propName || !holder) {
    return holder
  }

  if (propName in holder) {
    return holder[propName]
  }

  const propParts = Array.isArray(propName)
    ? propName
    : (propName + '').split('.')

  let result: unknown = holder
  while (propParts.length && result) {
    result = result[propParts.shift()]
  }

  return result
}

export function getResponseProp(
  response: HTTPResponse,
  prop: string | boolean
): unknown {
  if (typeof prop === 'string' && prop[0] === '.') {
    return getProp(response, prop.substring(1))
  } else {
    return getProp(response.data, prop + '')
  }
}

// Ie "Bearer " + token
export function addTokenPrefix(
  token: string | boolean,
  tokenType: string | false
): string | boolean {
  if (!token || !tokenType || (token + '').startsWith(tokenType)) {
    return token
  }

  return tokenType + ' ' + token
}

export function removeTokenPrefix(
  token: string | boolean,
  tokenType: string | false
): string | boolean {
  if (!token || !tokenType) {
    return token
  }

  return (token + '').replace(tokenType + ' ', '')
}

export function urlJoin(...args: string[]): string {
  return args
    .join('/')
    .replace(/[/]+/g, '/')
    .replace(/^(.+):\//, '$1://')
    .replace(/^file:/, 'file:/')
    .replace(/\/(\?|&|#[^!])/g, '$1')
    .replace(/\?/g, '&')
    .replace('&', '?')
}

export function cleanObj<T extends Record<string, unknown>>(
  obj: T
): RecursivePartial<T> {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key]
    }
  }

  return obj as RecursivePartial<T>
}
