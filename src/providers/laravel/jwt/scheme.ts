import RefreshScheme from '../../../schemes/refresh'
import { HTTPResponse } from '../../../index'

export default class LaravelJWT extends RefreshScheme {
  protected updateTokens(
    response: HTTPResponse,
    { isRefreshing = false, updateOnRefresh = false } = {}
  ): void {
    super.updateTokens(response, { isRefreshing, updateOnRefresh })
  }
}
