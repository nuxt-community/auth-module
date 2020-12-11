export enum TokenStatusEnum {
  UNKNOWN = 'UNKNOWN',
  VALID = 'VALID',
  EXPIRED = 'EXPIRED'
}

export default class TokenStatus {
  private readonly status: TokenStatusEnum

  constructor(token: string | false, tokenExpiresAt: number | false) {
    this.status = this.calculate(token, tokenExpiresAt)
  }

  unknown(): boolean {
    return TokenStatusEnum.UNKNOWN === this.status
  }

  valid(): boolean {
    return TokenStatusEnum.VALID === this.status
  }

  expired(): boolean {
    return TokenStatusEnum.EXPIRED === this.status
  }

  private calculate(
    token: string | false,
    tokenExpiresAt: number | false
  ): TokenStatusEnum {
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
}
