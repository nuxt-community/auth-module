import { AuthPlugin } from '../inc/AuthPlugin'

export default class StrategyPlugin extends AuthPlugin {
  constructor (auth, options) {
    super(auth, options)

    this.strategies = {}
  }

  get strategy () {
    return this.strategies[this.$state.strategy]
  }

  registerStrategy (name, strategy) {
    this.strategies[name] = strategy
  }

  setStrategy (name) {
    if (name === this.$storage.getUniversal('strategy')) {
      return Promise.resolve()
    }

    // Set strategy
    this.$storage.setUniversal('strategy', name)

    // Call mounted hook on active strategy
    return this.mounted()
  }
}
