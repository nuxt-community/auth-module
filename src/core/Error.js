import { AuthPlugin } from '../inc/AuthPlugin'

export default class ErrorPlugin extends AuthPlugin {
  constructor (auth, options) {
    super(auth, options)

    this._errorListeners = []
  }

  hook (listener) {
    this._errorListeners.push(listener)
  }

  catch (error, payload = {}) {
    // TODO
    // this.error = error

    for (const fn of this._errorListeners) {
      fn(error, payload)
    }
  }
}
