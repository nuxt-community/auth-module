# Oauth2

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/oauth2.js)

`oauth2` supports various oauth2 login flows. There are many pre-configured [providers](../providers/README.md)  that you may use instead of directly using this scheme.

## Usage

```js
this.$auth.loginWith('social')
```

## Options

```js
auth: {
  strategies: {
    social: {
      _scheme: 'oauth2',
      authorization_endpoint: 'https://accounts.google.com/o/oauth2/auth',
      userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
      scope: ['openid', 'profile', 'email'],
      access_type: undefined,
      access_token_endpoint: undefined,
      response_type: 'token',
      token_type: 'Bearer',
      redirect_uri: undefined,
      client_id: 'SET_ME',
      token_key: 'access_token',
      state: 'UNIQUE_AND_NON_GUESSABLE'
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

### `access_type`

If using Google code authorization flow (`response_type: 'code'`) set to `offline` to ensure a refresh token is returned in the initial login request. (See [Google documentation](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens))

### `access_token_endpoint`

If using Google code authorization flow (`response_type: 'code'`) provide a URI for a service that accepts a POST request with JSON payload containing a `code` property, and returns tokens [exchanged by provider](https://developers.google.com/identity/protocols/OpenIDConnect#exchangecode) for `code`. See [source code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/oauth2.js)

### `token_type`

By default is `Bearer`. It will be used in `Authorization` header of axios requests.

### `redirect_uri`

By default it will be inferred from `redirect.callback` option. (Defaults to `/login`)

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

### `client_id`

**REQUIRED** - oauth2 client id.

### `token_key`

By default is set to `token_key: 'access_token'`. If you need to use the IdToken instead of the AccessToken, set this option to `token_key: 'id_token'`.

### `refresh_token_key`

By default is set to `refresh_token_key: 'refresh_token'`. It automatically store the refresh_token, if it exists.

### `state`

By default is set to random generated string.

The primary reason for using the state parameter is to mitigate CSRF attacks. ([read more](https://auth0.com/docs/protocols/oauth2/oauth-state))
