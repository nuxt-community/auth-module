import RefreshScheme from '../../../schemes/refresh'

export default class LaravelJWT extends RefreshScheme {
  updateTokens(
    response,
    { isRefreshing = false, updateOnRefresh = false } = {}
  ) {
    super.updateTokens(response, { isRefreshing, updateOnRefresh })
  }
}
