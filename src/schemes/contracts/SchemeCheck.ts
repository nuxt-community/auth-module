export interface SchemeCheck {
  valid: boolean
  tokenExpired?: boolean
  refreshTokenExpired?: boolean
  isRefreshable?: boolean
}

export default SchemeCheck
