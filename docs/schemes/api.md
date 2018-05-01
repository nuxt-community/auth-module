# Api Scheme

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/api.js)

`api` is a general purpose authentication scheme, supporting `Cookie` and `JWT` login flows.

As [`local`](./local.md) scheme, it allows to authenticate against a backend api with the difference that the user is sent to an external url to complete the authorization step.

This is particularly useful to handle `oauth2` providers from a backend API.  

## Usage

```js
auth: {
  strategies: {
    'api.provider': {
      _scheme: 'api',
      authorization_endpoint: '/api/auth/social/provider'
      // tokenRequired: true,
      // tokenType: 'bearer',
    }
  }
}
```

### `tokenRequired`

This option can be used to disable all token handling. Useful for Cookie only flows. \(Enabled by default\)

### `tokenType`

- Default: `Bearer`

Authotization header type to be used in axios requests.

## Usage

```js
this.$auth.loginWith('api.provider')
```
