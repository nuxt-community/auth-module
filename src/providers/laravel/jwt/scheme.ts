import RefreshScheme from '../../../schemes/refresh'

export default class LaravelJWT extends RefreshScheme {
  _updateTokens (response, { isRefreshing = false, updateOnRefresh = false } = {}) {
    super._updateTokens(response, { isRefreshing, updateOnRefresh })
  }
}
