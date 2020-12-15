import type { RefreshableScheme, HTTPResponse } from '../types'
import type { Auth } from '../core'

export class RefreshController {
  public $auth: Auth
  private _refreshPromise: Promise<HTTPResponse | void> = null

  constructor(public scheme: RefreshableScheme) {
    this.$auth = scheme.$auth
  }

  // Multiple requests will be queued until the first has completed token refresh.
  handleRefresh(): Promise<HTTPResponse | void> {
    // Another request has started refreshing the token, wait for it to complete
    if (this._refreshPromise) {
      return this._refreshPromise
    }

    return this._doRefresh()
  }

  // Returns a promise which is resolved when refresh is completed
  // Call this function when you intercept a request with an expired token.

  private _doRefresh(): Promise<HTTPResponse | void> {
    this._refreshPromise = new Promise((resolve, reject) => {
      this.scheme
        .refreshTokens()
        .then((response) => {
          this._refreshPromise = null
          resolve(response)
        })
        .catch((error) => {
          this._refreshPromise = null
          reject(error)
        })
    })

    return this._refreshPromise
  }
}
