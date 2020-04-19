export default class FetchUserResponseError extends Error {
  constructor () {
    super('There is an error getting a response when fetching user data.')
    this.name = 'FetchUserResponseError'
  }
}
