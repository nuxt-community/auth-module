import { encodeQuery } from 'src/utils'
import { Oauth2Scheme } from 'src/schemes/oauth2'

export default class Auth0 extends Oauth2Scheme {
  logout(): void {
    this.$auth.reset()

    const opts = {
      client_id: this.options.clientId + '',
      returnTo: this.logoutRedirectURI
    }
    const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
    window.location.replace(url)
  }
}
