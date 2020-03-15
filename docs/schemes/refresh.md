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
this.$auth.refreshTokens()
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
          property: 'access_token',
          maxAge: 1800,
          // type: 'Bearer'
        },
        expiresIn: 'expires_in',
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: 'user',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          refresh: { url: '/api/auth/refresh', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' },
          logout: { url: '/api/auth/logout', method: 'post' }
        }
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

#### `name`

- Default: `Authorization`

Authorization header name to be used in axios requests.

#### `type`

- Default: `Bearer`

Authorization header type to be used in axios requests.

#### `maxAge`

- Default: `1800`

Here you set the expiration time of the token, in **seconds**.
This time will be used if for some reason we couldn't decode the token to get the expiration date.

By default is set to 30 minutes.

### `refreshToken`

Here you configure the refresh token options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.refresh_token`.

#### `data`

- Default: `refresh_token`

`data` can be used to set the name of the property you want to send in the request.

#### `maxAge`

- Default: `60 * 60 * 24 * 30`

Here you set the expiration time of the token, in **seconds**.
This time will be used if for some reason we couldn't decode the token to get the expiration date.
You can set it to `false` if your refresh token doesn't expire.

By default is set to 30 minutes.

### `user`

Here you configure the user options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.user`.
 
#### `autoFetch`
 
- Default: `true`
 
This option can be used to disable user fetch after login. It is useful when your login response already have the user.

### `clientId`

Here you configure the client id options.

#### `property`

- Default `client_id`

`clientId` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.client_id`

#### `data`

- Default: `client_id`

`data` can be used to set the name of the property you want to send in the request.

::: tip
To disable clientId, simply set it's value to `false`.
:::

### `grantType`

Here you configure the grant type options.

#### `data`

- Default: `grant_type`

`data` can be used to set the name of the property you want to send in the request.

#### `value`

- Default: `refresh_token`

It's the value of the grant type you want.

::: tip
To disable grantType, simply set it's value to `false`.
:::

### `autoRefresh`

- Default: `false`

When enabled it will refresh the token before it expires. The auto refresh will happen when the time reach 75% of the expiration time or when the page is reloaded.

### `autoLogout`

- Default: `false`

This option will logout the user on load the page, if token has expired.

::: tip
Mostly used with [`autoRefresh`](#autorefresh).
:::
