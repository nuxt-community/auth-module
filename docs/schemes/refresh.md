# Refresh

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/refresh.js)

`refresh` is an extended version of `local` scheme, made for systems that use token refresh.

You can set `_scheme` to `refresh` to enable it.

## Usage

To do a password based login by sending credentials in request body as a JSON object:

```js
this.$auth.loginWith('local', {
  data: {
    username: 'your_username',
    password: 'your_password'
  }
})
```

To manually refresh the token:

```js
this.$auth.refreshToken()
```

Or enable [autoRefresh](#autorefresh) option to automatically refresh tokens.

## Options

Example for a token based flow:

```js
auth: {
    strategies: {
      local: {
        _scheme: 'refresh',
        token: {
          property: 'access_token'
        },
        expiresIn: 'expires_in',
        refreshToken: {
          property: 'refresh_token'
        },
        user: 'user',
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' },
          logout: { url: '/api/auth/logout', method: 'post' }
        },
        // tokenType: 'bearer'
      }
    }
  }
```

Example of auto refresh usage:

```js
auth: {
    strategies: {
      local: {
        _scheme: 'refresh',
        token: {
          property: 'access_token'
        },
        expiresIn: 'expires_in',
        refreshToken: {
          property: 'refresh_token'
        },
        user: 'user',
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' },
          logout: { url: '/api/auth/logout', method: 'post' }
        },
        autoRefresh: {
          enable: true
        },
        autoLogout: true,
        // tokenType: 'bearer'
      }
    }
  }
```

### `endpoints`

Each endpoint is used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

::: tip
To disable each endpoint, simply set it's value to `false`.
:::

### `token`

Here you configure the token options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.token`.

#### `maxAge`

- Default: `1800`

Different from [expiresIn](#expiresin), here you set the default expiration time of the token, in **milliseconds**.
This time will be used if for some reason we couldn't get the value of [expiresIn](#expiresin).

By default its value is 30 minutes.

### `expiresIn`

This is the token expiration time, in **milliseconds**. We will use this value to automatically generate the expiration date if we couldn't decode the token.

`expiresIn` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.expires_in`

### `issuedAt`

`issuedAt` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.created_at`

By default we try to decode the token, if we couldn't decode the token we will automatically generate the issue date if `issuedAt` is not defined.

### `expiresAt`

`expiresAt` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.created_at`

By default we try to decode the token, if we couldn't decode the token we will automatically generate the expiration date using the [expiresIn](#expiresin) and [issuedAt](#issuedat) values if `expiresAt` is not defined.

### `refreshToken`

Here you configure the refresh token options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.refresh_token`.

#### `maxAge`

- Default: `60 * 60 * 24 * 30`

Here you set the expiration time of the refresh token, in **milliseconds**.
You can set it to `false` if your refresh token doesn't expire.

### `dataRefreshToken`

- Default: `refresh_token`

`dataRefreshToken` can be used to set the name of the property you want to send in the request.

If you don't need it, you can set it to `false`.

### `user`

`user` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.user`.

### `clientId`

`clientId` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.client_id`

This option is for systems that uses client id. If you don't use client id, you can set it to `false`.

### `dataClientId`

- Default: `client_id`

`dataClientId` can be used to set the name of the property you want to send in the request.

This option is for systems that uses client id. If you don't use client id, you can set it to `false`.

### `grantType`

- Default: `refresh_token`

It's the value of the grant type you want.

This option is for systems that uses grant type. If you don't use grant type, you can set it to `false`.

### `dataGrantType`

- Default: `grant_type`

`dataGrantType` can be used to set the name of the property you want to send in the request.

This option is for systems that uses grant type. If you don't use grant type, you can set it to `false`.

### `autoRefresh`

Here you configure the auto refresh options.

When enabled it will refresh the token before it expires. The auto refresh will happen when the time reach 75% of the expiration time or when the page is reloaded.

#### `enable`

- Default: `false`

This option enables auto refresh.

### `autoLogout`

- Default: `false`

This option will logout the user on load the page, if token has expired.

::: tip
Mostly used with [`autoRefresh`](#autorefresh).
:::

### `tokenName`

- Default: `Authorization`

Authorization header name to be used in axios requests.

### `tokenType`

- Default: `Bearer`

Authorization header type to be used in axios requests.
