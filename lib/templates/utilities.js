/**
 * Utility to get route option
 * @param {*} route
 * @param {*} key
 * @param {*} value
 */
export const routeOption = (route, key, value) => {
  return route.matched.some(m => {
    // Browser
    if (process.browser) {
      return Object.values(m.components).some(
        component => component.options[key] === value
      )
    }
    // SSR
    return Object.values(m.components).some(component =>
      Object.values(component._Ctor).some(
        ctor => ctor.options && ctor.options[key] === value
      )
    )
  })
}
