import Oauth2Scheme from '../../schemes/oauth2'
import { encodeQuery } from '../../utils'

export default class Auth0 extends Oauth2Scheme {
  logout () {
    this.$auth.reset()

    const opts = {
      client_id: this.options.clientId + '',
      returnTo: this._logoutRedirectURI
    }
    const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
    window.location.replace(url)
  }
}
