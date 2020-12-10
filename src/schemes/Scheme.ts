import { HTTPRequest, HTTPResponse } from '../index'
import _Scheme from './_scheme'
import SchemeOptions from './contracts/SchemeOptions'
import SchemeCheck from './contracts/SchemeCheck'

export interface Scheme<OptionsT extends SchemeOptions>
  extends _Scheme<OptionsT> {
  options: OptionsT
  mounted?(): Promise<HTTPResponse | void>
  check?(checkStatus: boolean): SchemeCheck
  login(...args: unknown[]): Promise<HTTPResponse | void>
  fetchUser(endpoint?: HTTPRequest): Promise<HTTPResponse | void>
  setUserToken?(
    token: string,
    refreshToken?: string
  ): Promise<HTTPResponse | void>
  logout?(endpoint?: HTTPRequest): Promise<void>
  reset?(options?: { resetInterceptor: boolean }): void
}

export default Scheme
