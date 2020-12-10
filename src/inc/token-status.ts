export enum TokenStatusEnum {
  UNKNOWN = 'UNKNOWN',
  VALID = 'VALID',
  EXPIRED = 'EXPIRED'
}

export default class TokenStatus {
  private _status: TokenStatusEnum

  constructor(token, tokenExpiresAt) {
    this._status = this._calculate(token, tokenExpiresAt)
  }

  _calculate(token, tokenExpiresAt) {
    const now = Date.now()

    try {
      if (!token || !tokenExpiresAt) {
        return TokenStatusEnum.UNKNOWN
      }
    } catch (error) {
      return TokenStatusEnum.UNKNOWN
    }

    // Give us some slack to help the token from expiring between validation and usage
    const timeSlackMillis = 500
    tokenExpiresAt -= timeSlackMillis

    // Token is still valid
    if (now < tokenExpiresAt) {
      return TokenStatusEnum.VALID
    }

    return TokenStatusEnum.EXPIRED
  }

  unknown() {
    return TokenStatusEnum.UNKNOWN === this._status
  }

  valid() {
    return TokenStatusEnum.VALID === this._status
  }

  expired() {
    return TokenStatusEnum.EXPIRED === this._status
  }
}
