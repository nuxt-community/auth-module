---
title: Refresh
description: refresh is an extended version of local scheme, made for systems that use token refresh.
position: 24
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/refresh.ts)

`refresh` is an extended version of `local` scheme, made for systems that use token refresh.

You can set `scheme` to `refresh` to enable it.

## Usage

To do a password based login by sending credentials in request body as a JSON object:

```vue
<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Username</label>
        <input type="text" v-model="login.username" />
      </div>
      <div>
        <label>Password</label>
        <input type="text" v-model="login.password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        let response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
```

To manually refresh the token:

```js
this.$auth.refreshTokens()
```

## Options

```js
auth: {
  strategies: {
    local: {
      scheme: 'refresh',
      token: {
        property: 'access_token',
        maxAge: 1800,
        // type: 'Bearer'
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
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
      },
      // autoLogout: false
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

By default is set to 30 days.

#### `required`

- Default: `true`

In instances where you do not need the refresh token to perform the refresh, you can assign this option to `false`. This disables the `refreshToken`.

#### `tokenRequired`

- Default: `false`

If enabled, Authorization header won't be cleared before refreshing.

### `user`

Here you configure the user options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.user`.
 
#### `autoFetch`
 
- Default: `true`
 
This option can be used to disable user fetch after login. It is useful when your login response already have the user.

### `clientId`

- Default: `false`

If your backend requires client id, it can be set here.

### `grantType`

- Default: `false`

If your backend requires grant type, it can be set here.

### `scope`

- Default: `false`

If your backend requires scope, it can be set here.

### `autoLogout`

- Default: `false`

If the token has expired, it will prevent the token from being refreshed on load the page and force logout the user.
