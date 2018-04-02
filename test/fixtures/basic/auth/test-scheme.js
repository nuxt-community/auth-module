export default class LocalScheme {
  constructor (auth, options) {
    this.$auth = auth
    this.name = options._name
  }

  mounted () {
    // eslint-disable-next-line no-console
    console.log('Mounted test provider: ' + this.name)
  }
}
