# Oauth2 Scheme

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/oauth2.js)

`oauth2` supports various oauth2 login flows.

It is recommended to use a [Provider](../providers/README.md) instead if possible.

## Usage

```js
auth: {
  strategies: {
    social: {
      _scheme: 'oauth2'
      authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
      userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['openid', 'profile', 'email'],
      response_type: 'token',
      token_type: 'Bearer',
      redirect_uri: undefined,
      client_id: 'SET_ME',
    }
  }
}
```

### `authorization_endpoint`

**REQUIRED** - Endpoint to start login flow. Depends on oauth service.

### `userinfo_endpoint`

While not a part of oauth2 spec, almost all oauth2 providers expose this endpoint to get user profile.

If a `false` value is set, we only do login without fetching user profile.

### `scope`

**REQUIRED** -  Oauth2 access scopes.

### `response_type`

By default is `token`. If you use `code` you may have to implement a server side logic to sign the response code.

### `token_type`

By default is `Bearer`. It will be used in `Authorization` header of axios requests.

### `redirect_uri`

By default it will be inferred from `redirect.callback` option. (Defaults to `/login`)

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

### `client_id`

**REQUIRED** - oauth2 client id.

## Usage

```js
this.$auth.loginWith('social')
```
