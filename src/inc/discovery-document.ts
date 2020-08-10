// import { intersection } from 'lodash'
import type { Scheme } from '../index'
import Storage from '../core/storage'

export default class DiscoveryDocument {
  public scheme: Scheme
  public $storage: Storage
  public key: string

  constructor (scheme: Scheme, storage: Storage) {
    this.scheme = scheme
    this.$storage = storage
    this.key = '_discovery_document.' + this.scheme.name
  }

  _set (value: boolean) {
    return this.$storage.setState(this.key, value)
  }

  get () {
    return this.$storage.getState(this.key)
  }

  set (value: any) {
    this._set(value)

    return value
  }

  async load () {
    // Get Discovery Document from state hydration
    const serverDoc = this.scheme.$auth.ctx?.nuxtState?.$auth?.oidc?.discoveryDocument
    if (process.client && serverDoc) {
      this.set(serverDoc)
    }

    if (!this.get()) {
      const discoveryDocument = await this.scheme.requestHandler.axios.$get(
        this.scheme.options.baseURL + this.scheme.options.endpoints.discovery
      ).catch(e => Promise.reject(e))

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
    // TODO: test if this error triggers
    if (!this.scheme.options.baseURL) {
      throw new Error('Declare OpenIDConnect baseURL')
    }

    await this.load().catch(() => {
      // TODO: test if this error triggers
      throw new Error('Error loading OpenIDConnect discovery document')
    })

    // TODO: validate configuration against loaded discovery document

    this.setSchemeEndpoints()
  }

  setSchemeEndpoints () {
    const discoveryDocument = this.get()

    this.scheme.options.endpoints = {
      ...this.scheme.options.endpoints,
      authorization: discoveryDocument.authorization_endpoint,
      token: discoveryDocument.token_endpoint,
      userInfo: discoveryDocument.userinfo_endpoint,
      logout: discoveryDocument.end_session_endpoint
    }
  }

  reset () {
    this._set(false)
  }
}
