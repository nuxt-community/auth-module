export default class RefreshTokenResponseError extends Error {
  constructor () {
    super('There is an error getting a response when refreshing the token.')
    this.name = 'RefreshTokenResponseError'
  }
}
