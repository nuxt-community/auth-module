import type { Scheme, Auth } from '../'

export default class RefreshController {
  public $auth: Auth
  private _refreshPromise = null

  constructor (public scheme: Scheme) {
    this.$auth = scheme.$auth
  }

  _doRefresh () {
    this._refreshPromise = new Promise((resolve, reject) => {
      this.scheme.refreshTokens().then((response) => {
        this._refreshPromise = null
        resolve(response)
      }).catch((error) => {
        this._refreshPromise = null
        reject(error)
      })
    })

    return this._refreshPromise
  }

  // Returns a promise which is resolved when refresh is completed
  // Call this function when you intercept a request with an expired token.
  // Multiple requests will be queued until the first has completed token refresh.
  handleRefresh () {
    // Another request has started refreshing the token, wait for it to complete
    if (this._refreshPromise) {
      return this._refreshPromise
    }

    return this._doRefresh()
  }
}
