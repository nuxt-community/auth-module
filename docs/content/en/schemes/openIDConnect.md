---
title: OpenIDConnect
description: OpenID Connect 1.0 is a simple identity layer on top of the OAuth 2.0 protocol. It enables Clients to verify the identity of the End-User based on the authentication performed by an Authorization Server, as well as to obtain basic profile information about the End-User in an interoperable and REST-like manner.
position: 23
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/openIDConnect.ts)

As the OpenID Connect is a layer on top of the OAuth 2.0 protocol, this scheme extends the OAuth 2.0 scheme.

Please see the [OAuth2 scheme](./oauth2) for more information.

## Usage

```js
this.$auth.loginWith('openIDConnect')
```

Additional arguments can be passed through to the OpenID Connect provider using the `params` key of the second argument:

```js
this.$auth.loginWith('openIDConnect', { params: { another_post_key: 'value' } })
```

## Options
Minimal configuration:
```js
auth: {
  strategies: {
    social: {
      name: 'openIDConnect',
      clientId: 'CLIENT_ID',
      endpoints: {
        configuration: 'https://accounts.google.com/.well-known/openid-configuration',
      },
    }
  }
}
```

Default configuration:
```js
auth: {
  strategies: {
    social: {
      name: 'openIDConnect',
      endpoints: {
        configuration: 'https://accounts.google.com/.well-known/openid-configuration',
      },
      idToken: {
        property: 'id_token',
        maxAge: 60 * 60 * 24 * 30,
        prefix: '_id_token.',
        expirationPrefix: '_id_token_expiration.'
      },
      responseType: 'code',
      grantType: 'authorization_code',
      scope: ['openid', 'profile', 'offline_access'],
      codeChallengeMethod: 'S256',
    }
  }
}
```

### `endpoints`

Each endpoint is used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

#### `configuration`

**REQUIRED** - Endpoint to request the provider's metadata document to automatically set the endpoints. A metadata document that contains most of the OpenID Provider's information, such as the URLs to use and the location of the service's public signing keys. You can find this document by appending the discovery document path (/.well-known/openid-configuration) to the authority URL (https://example.com).
 
Eg. `https://example.com/.well-known/openid-configuration`
 
More info: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig

Each endpoint defined in the OAuth2 scheme can also be used in the OpenID Connect scheme configuration. This will override the information provided by the configuration document.

### `clientId`

**REQUIRED** - OpenID Connect client id.

### `scope`

- Default: `['openid', 'profile', 'offline_access']`

OpenID Connect access scopes.

### `token`

Access token

#### `property`

- Default: `access_token`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.access_token`.

#### `type`

- Default: `Bearer`

It will be used in `Authorization` header of axios requests.

#### `maxAge`

- Default: `1800`

Here you set the expiration time of the token, in **seconds**.
This time will be used if for some reason we couldn't decode the token to get the expiration date.

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

By default is set to 30 minutes.

### `idToken`

The OpenIDConnect scheme will save both the access and ID token. This because to end the user-session at the authorization server, the ID token needs to be part of the logout request via the required parameter `id_token_hint`.

#### `property`

- Default: `id_token`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.id_token`.

#### `maxAge`

- Default: `1800`

Here you set the expiration time of the ID token, in **seconds**.
This time will be used if for some reason we couldn't decode the ID token to get the expiration date.

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

- Default: `code`

Set to `code` for authorization code flow.

### `grantType`

- Default: `authorization_code`

Set to `authorization_code` for authorization code flow.

### `redirectUri`

Should be same as login page or relative path to welcome screen. ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

By default it will be inferred from `redirect.callback` option. (Defaults to `/login`)

### `logoutRedirectUri`

Should be an absolute path to the welcome screen

### `codeChallengeMethod`

By default is 'implicit' which is the current workflow implementation. In order to support PKCE ('pixy') protocol, valid options include 'S256' and 'plain'. ([read more](https://tools.ietf.org/html/rfc7636))

Default: `S256`

### `acrValues`

Provides metadata to supply additional information to the authorization server. ([read more](https://ldapwiki.com/wiki/Acr_values))

### `autoLogout`

- Default: `false`

If the token has expired, it will prevent the token from being refreshed on load the page and force logout the user.
