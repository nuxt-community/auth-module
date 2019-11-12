export default class ExpiredAuthSessionError extends Error {
  constructor () {
    super('Both token and refresh token have expired. Your request was aborted. ' +
      'You should catch this exception to stop it from surfacing.')
    this.name = 'ExpiredAuthSessionError'
  }
}
