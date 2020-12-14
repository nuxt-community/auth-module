import RefreshScheme from 'src/schemes/refresh'
import { HTTPResponse } from 'src/index'

export default class LaravelJWT extends RefreshScheme {
  protected updateTokens(
    response: HTTPResponse,
    { isRefreshing = false, updateOnRefresh = false } = {}
  ): void {
    super.updateTokens(response, { isRefreshing, updateOnRefresh })
  }
}
