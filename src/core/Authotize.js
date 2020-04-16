import { AuthPlugin } from '../inc/AuthPlugin'

import { getProp } from './utilities'

export default class AuthorizePlugin extends AuthPlugin {
  is (scope) {
    const user = this.auth.user.get()
    const userScopes = user && getProp(user, this.options.scopeKey)

    if (!userScopes) {
      return false
    }

    if (Array.isArray(userScopes)) {
      return userScopes.includes(scope)
    }

    return Boolean(getProp(userScopes, scope))
  }
}
