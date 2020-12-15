import type { HTTPResponse } from 'src'
import { RefreshScheme } from 'src/schemes/refresh'

export default class LaravelJWT extends RefreshScheme {
  protected updateTokens(
    response: HTTPResponse,
    { isRefreshing = false, updateOnRefresh = false } = {}
  ): void {
    super.updateTokens(response, { isRefreshing, updateOnRefresh })
  }
}
