# Oauth2

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/oauth2.js)

`oauth2` supports various oauth2 login flows. There are many pre-configured providers like [auth0](../providers/auth0.md) that you may use instead of directly using this scheme.

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
      endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/auth',
          token: undefined,
          userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo'
      },
      token: {
          property: 'access_token',
          type: 'Bearer'
      },
      refreshToken: {
          property: 'refresh_token'
      },
      responseType: 'token',
      accessType: undefined,
      redirectUri: undefined,
      clientId: 'SET_ME',
      scope: ['openid', 'profile', 'email'],
      state: 'UNIQUE_AND_NON_GUESSABLE'
    }
  }
}
```

### `endpoints`

Each endpoint is used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

#### `authorization`

**REQUIRED** - Endpoint to start login flow. Depends on oauth service.

#### `userInfo`

While not a part of oauth2 spec, almost all oauth2 providers expose this endpoint to get user profile.

#### `token`

If using Google code authorization flow (`responseType: 'code'`) provide a URI for a service that accepts a POST request with JSON payload containing a `code` property, and returns tokens [exchanged by provider](https://developers.google.com/identity/protocols/OpenIDConnect#exchangecode) for `code`. See [source code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/oauth2.js)


If a `false` value is set, we only do login without fetching user profile.

### token

#### `property`

By default is set to `property: 'access_token'`. If you need to use the IdToken instead of the AccessToken, set this option to `property: 'id_token'`.

#### `type`

By default is `Bearer`. It will be used in `Authorization` header of axios requests.

### `refreshToken`

#### `property`

By default is set to `property: 'refresh_token'`. It automatically store the refresh_token, if it exists.

### `responseType`

By default is `token`. If you use `code` you may have to implement a server side logic to sign the response code.

### `accessType`

If using Google code authorization flow (`response_type: 'code'`) set to `offline` to ensure a refresh token is returned in the initial login request. (See [Google documentation](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens))

### `redirectUri`

By default it will be inferred from `redirect.callback` option. (Defaults to `/login`)

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

### `clientId`

**REQUIRED** - oauth2 client id.

### `scope`

**REQUIRED** -  Oauth2 access scopes.

### `state`

By default is set to random generated string.

The primary reason for using the state parameter is to mitigate CSRF attacks. ([read more](https://auth0.com/docs/protocols/oauth2/oauth-state))
