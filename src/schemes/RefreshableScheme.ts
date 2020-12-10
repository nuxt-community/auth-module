import RefreshToken from '../inc/refresh-token'
import { HTTPResponse } from '../index'
import { RefreshTokenOptions } from './contracts/SchemeOptions'
import TokenableScheme, { TokenableSchemeOptions } from './TokenableScheme'

export interface RefreshableSchemeOptions extends TokenableSchemeOptions {
  refreshToken: RefreshTokenOptions
}

export interface RefreshableScheme<
  OptionsT extends RefreshableSchemeOptions = RefreshableSchemeOptions
> extends TokenableScheme<OptionsT> {
  refreshToken: RefreshToken
  refreshTokens(): Promise<HTTPResponse>
}

export default RefreshableScheme
