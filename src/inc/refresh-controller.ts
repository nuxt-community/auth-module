import Auth from '../core/auth'
import RefreshableScheme from '../schemes/RefreshableScheme'
import { HTTPResponse } from '../index'

export default class RefreshController {
  public $auth: Auth
  private refreshPromise: Promise<HTTPResponse | void> = null

  constructor(public scheme: RefreshableScheme) {
    this.$auth = scheme.$auth
  }

  // Multiple requests will be queued until the first has completed token refresh.
  handleRefresh(): Promise<HTTPResponse | void> {
    // Another request has started refreshing the token, wait for it to complete
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    return this.doRefresh()
  }

  // Returns a promise which is resolved when refresh is completed
  // Call this function when you intercept a request with an expired token.

  private doRefresh(): Promise<HTTPResponse | void> {
    this.refreshPromise = new Promise((resolve, reject) => {
      this.scheme
        .refreshTokens()
        .then((response) => {
          this.refreshPromise = null
          resolve(response)
        })
        .catch((error) => {
          this.refreshPromise = null
          reject(error)
        })
    })

    return this.refreshPromise
  }
}
