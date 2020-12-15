export class ExpiredAuthSessionError extends Error {
  constructor() {
    super(
      'Both token and refresh token have expired. Your request was aborted.'
    )
    this.name = 'ExpiredAuthSessionError'
  }
}
