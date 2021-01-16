---
title: OAuth2
description: oauth2 supports various oauth2 login flows. There are many pre-configured providers like auth0 that you may use instead of directly using this scheme.
position: 23
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/oauth2.ts)

`oauth2` supports various oauth2 login flows. There are many pre-configured providers like [auth0](../../providers/auth0) that you may use instead of directly using this scheme.

## Usage

```js
this.$auth.loginWith('social')
```

Additional arguments can be passed through to the OAuth provider using the `params` key of the second argument:

```js
this.$auth.loginWith('social', { params: { another_post_key: "value" } })
```

## Token refresh

If your provider issues refresh tokens, these will be used to refresh the token before every axios request.
Note: This feature is only supported for jwt tokens.

### Behavior when the refresh token has expired

If the refresh token has expired, the token cannot be refreshed. You can find the different behavior for server and client side below.

#### Server side (during page reload or initial navigation)

The user is logged out and navigated to the **home** page.

#### Client side (Client initiated axios request)

The user is logged out and navigated to the **logout** page, for explicitly explaining what happened.

## Options

```js
auth: {
  strategies: {
    social: {
      scheme: 'oauth2',
      endpoints: {
        authorization: 'https://accounts.google.com/o/oauth2/auth',
        token: undefined,
        userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
        logout: 'https://example.com/logout'
      },
      token: {
        property: 'access_token',
        type: 'Bearer',
        maxAge: 1800
      },
      refreshToken: {
        property: 'refresh_token',
        maxAge: 60 * 60 * 24 * 30
      },
      responseType: 'token',
      grantType: 'authorization_code',
      accessType: undefined,
      redirectUri: undefined,
      logoutRedirectUri: undefined,
      clientId: 'SET_ME',
      scope: ['openid', 'profile', 'email'],
      state: 'UNIQUE_AND_NON_GUESSABLE',
      codeChallengeMethod: '',
      responseMode: '',
      acrValues: '',
      // autoLogout: false
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

If using Google code authorization flow (`responseType: 'code'`) provide a URI for a service that accepts a POST request with JSON payload containing a `code` property, and returns tokens [exchanged by provider](https://developers.google.com/identity/protocols/OpenIDConnect#exchangecode) for `code`. See [source code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/oauth2.ts)

If a `false` value is set, we only do login without fetching user profile.

#### `logout`

Endpoint to logout user from Oauth2 provider's system. Ensures that a user is signed out of the current authorization session.

### token

#### `property`

- Default: `access_token`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.access_token`.

::: tip
If you need to use the IdToken instead of the AccessToken, set this option to `id_token`.
:::

#### `type`

- Default: `Bearer`

It will be used in `Authorization` header of axios requests.

#### `maxAge`

- Default: `1800`

Here you set the expiration time of the token, in **seconds**.
This time will be used if for some reason we couldn't decode the token to get the expiration date.

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

By default is set to 30 minutes.

### `refreshToken`

#### `property`

- Default: `refresh_token`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.refresh_token`.

#### `maxAge`

- Default: `60 * 60 * 24 * 30`

Here you set the expiration time of the refresh token, in **seconds**.
This time will be used if for some reason we couldn't decode the token to get the expiration date.

By default is set to 30 days.

### `responseType`

- Default: `token`

If you use `code` you may have to implement a server side logic to sign the response code.

### `grantType`

Set to `authorization_code` for authorization code flow.

### `accessType`

If using Google code authorization flow (`responseType: 'code'`) set to `offline` to ensure a refresh token is returned in the initial login request. (See [Google documentation](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens))

### `redirectUri`

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

By default it will be inferred from `redirect.callback` option. (Defaults to `/login`)

### `logoutRedirectUri`

Should be an absolute path to the welcome screen

### `clientId`

**REQUIRED** - oauth2 client id.

### `scope`

**REQUIRED** -  Oauth2 access scopes.

### `state`

The primary reason for using the state parameter is to mitigate CSRF attacks. ([read more](https://auth0.com/docs/protocols/oauth2/oauth-state))

By default is set to random generated string.

### `codeChallengeMethod`

By default is 'implicit' which is the current workflow implementation. In order to support PKCE ('pixy') protocol, valid options include 'S256' and 'plain'. ([read more](https://tools.ietf.org/html/rfc7636))

### `acrValues`
Provides metadata to supply additional information to the authorization server. ([read more](https://ldapwiki.com/wiki/Acr_values))

### `autoLogout`

- Default: `false`

If the token has expired, it will prevent the token from being refreshed on load the page and force logout the user.
