import { HTTPRequest, HTTPResponse } from '../index'
import _Scheme from './_scheme'
import SchemeOptions from './contracts/SchemeOptions'
import SchemeCheck from './contracts/SchemeCheck'

export interface Scheme<OptionsT extends SchemeOptions = SchemeOptions>
  extends _Scheme<OptionsT> {
  options: OptionsT
  mounted?(...args: unknown[]): Promise<HTTPResponse | void>
  check?(checkStatus: boolean): SchemeCheck
  login(...args: unknown[]): Promise<HTTPResponse | void>
  fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void>
  setUserToken?(
    token: string | boolean,
    refreshToken?: string | boolean
  ): Promise<HTTPResponse | void>
  logout?(endpoint?: HTTPRequest): Promise<void> | void
  reset?(options?: { resetInterceptor: boolean }): void
}

export default Scheme
