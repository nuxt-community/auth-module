import type { ProviderOptions, ProviderPartialOptions } from '../types'
import type { Oauth2SchemeOptions } from '../schemes'
import { assignDefaults } from '../utils/provider'

export interface KakaoProviderOptions
  extends ProviderOptions,
    Oauth2SchemeOptions {}

export function kakao(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _nuxt: any,
  strategy: ProviderPartialOptions<KakaoProviderOptions>
): void {
  const DEFAULTS: typeof strategy = {
    scheme: 'oauth2',
    endpoints: {
      authorization: 'https://kauth.kakao.com/oauth/authorize',
      token: 'https://kauth.kakao.com/oauth/token',
      userInfo: 'https://kapi.kakao.com/v2/user/me'
    },
    token: {
      property: 'access_token',
      type: 'bearer'
    },
    responseType: 'code',
    grantType: 'authorization_code',
    scope: ['profile']
  }

  assignDefaults(strategy, DEFAULTS)
}
