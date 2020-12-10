import SchemeOptions, { UserOptions } from '../../contracts/SchemeOptions'
import { EndpointsOption, TokenableSchemeOptions } from '../../TokenableScheme'
import { RefreshableSchemeOptions } from '../../RefreshableScheme'

export interface Oauth2SchemeEndpoints extends EndpointsOption {
  authorization: string
  token: string
  userInfo: string
  logout: string
}

export interface Oauth2SchemeOptions extends SchemeOptions, TokenableSchemeOptions, RefreshableSchemeOptions {
  endpoints: Oauth2SchemeEndpoints
  user: UserOptions
  responseMode: 'query.jwt' | 'fragment.jwt' | 'form_post.jwt' | 'jwt'
  responseType: 'code' | 'token' | 'id_token' | 'none' | string
  grantType: 'implicit' | 'authorization_code' | 'client_credentials' | 'password' | 'refresh_token' | 'urn:ietf:params:oauth:grant-type:device_code'
  accessType: 'online' | 'offline'
  redirectUri: string
  logoutRedirectUri: string
  clientId: string | number
  scope: string[]
  state: string
  codeChallengeMethod: 'implicit' | 'S256' | 'plain'
  acrValues: string
  audience: string
  autoLogout: boolean
}

export default Oauth2SchemeOptions
