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
  return Object.keys(queryObject)
    .map(
      key =>
        encodeURIComponent(key) + '=' + encodeURIComponent(queryObject[key])
    )
    .join('&')
}

export const randomString = () => (process.browser ? btoa(Math.random() + '') : Buffer.from(Math.random() + '').toString('base64')).replace('==', '')

export const routeOption = (route, key, value) => {
  return route.matched.some(m => {
    if (process.browser) {
      // Browser
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
