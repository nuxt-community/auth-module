import defu from 'defu'
import type { Scheme, OpenIDConnectDiscoveryDocument } from '../index'
import Storage from '../core/storage'

class DiscoveryDocumentRequestError extends Error {
  constructor () {
    super('Error loading OpenIDConnect discovery document')
    this.name = 'DiscoveryDocumentRequestError'
  }
}

export default class DiscoveryDocument {
  public scheme: Scheme
  public $storage: Storage
  public key: string

  constructor (scheme: Scheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
    this.key = '_discovery_document.' + this.scheme.name
  }

  _set (value: OpenIDConnectDiscoveryDocument | boolean) {
    return this.$storage.setState(this.key, value)
  }

  get (): OpenIDConnectDiscoveryDocument {
    return this.$storage.getState(this.key)
  }

  set (value: OpenIDConnectDiscoveryDocument | boolean) {
    this._set(value)

    return value
  }

  async request () {
    // Get Discovery Document from state hydration
    const serverDoc: OpenIDConnectDiscoveryDocument = this.scheme.$auth.ctx?.nuxtState?.$auth?.oidc?.discoveryDocument
    if (process.client && serverDoc) {
      this.set(serverDoc)
    }

    if (!this.get()) {
      const discoveryDocument = await this.scheme.requestHandler.axios.$get(this.scheme.options.endpoints.discovery).catch(e => Promise.reject(e))

      // Push Discovery Document to state hydration
      if (process.server) {
        this.scheme.$auth.ctx.beforeNuxtRender(({ nuxtState }) => {
          nuxtState.$auth = {
            oidc: {
              discoveryDocument
            }
          }
        })
      }

      this.set(discoveryDocument)
    }
  }

  async init () {
    await this.request().catch(() => {
      throw new DiscoveryDocumentRequestError()
    })

    this.setSchemeEndpoints()
  }

  setSchemeEndpoints () {
    const discoveryDocument = this.get()

    this.scheme.options.endpoints = defu(this.scheme.options.endpoints, {
      authorization: discoveryDocument.authorization_endpoint,
      token: discoveryDocument.token_endpoint,
      userInfo: discoveryDocument.userinfo_endpoint,
      logout: discoveryDocument.end_session_endpoint
    })
  }

  reset () {
    this._set(false)
  }
}
