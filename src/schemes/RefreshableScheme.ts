import RefreshToken from 'src/inc/refresh-token'
import { HTTPResponse } from 'src/index'
import RefreshController from 'src/inc/refresh-controller'
import TokenableScheme, { TokenableSchemeOptions } from './TokenableScheme'
import { RefreshTokenOptions } from './index'

export interface RefreshableSchemeOptions extends TokenableSchemeOptions {
  refreshToken: RefreshTokenOptions
}

export interface RefreshableScheme<
  OptionsT extends RefreshableSchemeOptions = RefreshableSchemeOptions
> extends TokenableScheme<OptionsT> {
  refreshToken: RefreshToken
  refreshController: RefreshController
  refreshTokens(): Promise<HTTPResponse>
}

export default RefreshableScheme
