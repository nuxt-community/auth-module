/*
* The `TokenStatus` class provides information on the current Token's stats
* Statuses available:
*   UNKNOWN - UNKNOWN STATUS - WRONG TOKEN OR UNABLE TO DECODE EXPIRY DATE
*   EXPIRED - WHEN THE TOKEN'S DECODED DATA IS EXPIRED
*   VALID - TOKEN IS NOT EXPIRED AND READY TO USE WITH APIs
* */
export default class TokenStatus {
  constructor (token, tokenExpiresAt) {
    this._status = this._calculate(token, tokenExpiresAt)
  }

  _calculate (token, tokenExpiresAt) {
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

  unknown () {
    return TokenStatusEnum.UNKNOWN === this._status
  }

  valid () {
    return TokenStatusEnum.VALID === this._status
  }

  expired () {
    return TokenStatusEnum.EXPIRED === this._status
  }
}

const TokenStatusEnum = Object.freeze({
  UNKNOWN: 'UNKNOWN',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED'
})
