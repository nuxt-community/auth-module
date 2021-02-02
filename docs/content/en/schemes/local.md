---
title: Local
description: local is the default, credentials/token based scheme for flows like JWT.
position: 22
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/local.ts)

`local` is the default, credentials/token based scheme for flows like `JWT`.

**Note:** You can use [cookie scheme](./cookie) which is based on local but modified for cookie based APIs.

By default `local` scheme is enabled and preconfigured. You can set `strategies.local` to `false` to disable it.

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

## Backend

You'll need a backend server that implement the basics of authentication. As
this is very security-sensitive code, we strongly recommend that you use an
established authentication library for your backend, too.

The backend will, at minimum, need to handle login and logout. It will also, by
default, need to include an endpoint to fetch user information (ID, email, etc).
This can be disabled with [`endpoints.user = false`](/schemes/local#user) if
your frontend doesn't need to know anything about your user. In this case,
`this.$auth.user` will be `{}`.

### Login

The backend should verify the login credentials, then return a JSON body with
the token that the frontend can use to act as this user. The JSON body format
is configured in the [token section of the local scheme configuration](#token).

> TIP: If you want to use cookies instead of token-based authentication, use the
> [cookie](./cookie) scheme.

The entire backend response is passed through to the `loginWith` response,
so you can pass through additional information about the user, e.g. for
authorization (which is out of scope of @nuxtjs/auth).

### Fetch User

The auth module does not persist information about the user, so there needs to
be a way to fetch the user's information on e.g. page reload. That's what the
user endpoint is for. By default, this is also called after a successful login.

If [`user.autoFetch` is true (default)](#user), then a request to
`endpoints.user` is sent immediately after a successful login. That endpoint
should respond with the JSON information for a specific user, which is
assigned directly to [the user property](../api/auth#user).

If you'd prefer to return the user's information directly from the login
session, configure `user.autoFetch` to false, fetch the user information from the
`loginWith` response, and pass it in to [`setUser`](../api/auth#setuseruser).

If you want to disable fetching user info entirely, set `endpoints.user: false`.
This will mean the user info endpoint is never called, but will also mean the
frontend doesn't know anything about the user; `this.$auth.user` will be `{}`.

## Options

Example for a token based flow:

```js
auth: {
  strategies: {
    local: {
      token: {
        property: 'token',
        // required: true,
        // type: 'Bearer'
      },
      user: {
        property: 'user',
        // autoFetch: true
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
        logout: { url: '/api/auth/logout', method: 'post' },
        user: { url: '/api/auth/user', method: 'get' }
      }
    }
  }
}
```

Example for a cookie based flow:

```js
auth: {
  strategies: {
    local: {
      token: {
        required: false,
        type: false
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
      }
    }
  }
}
```

### `endpoints`

Each endpoint is used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

::: tip
To disable each endpoint, simply set its value to `false`.
:::

### `token`

Here you configure the token options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.token`.

#### `required`

- Default: `true`

This option can be used to disable all token handling.

::: tip
Useful for Cookie only flows.
:::

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

### `user`

Here you configure the user options.

#### `property`

`property` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.user`.

#### `autoFetch`

- Default: `true`

By default, auth will load the user's info using a second HTTP request after a
successful login. This option disables that request, but does not disable
fetching user info from the user endpoint; set `endpoints.user: false` for that.

> TIP: Set this to false when you want to return the user info from your login request to save an extra HTTP roundtrip. To do so, get the response from `loginWith` and pass the data to [setUser](../api/auth#setuser-user). Note that, unless you disable the user endpoint with `endpoints.user: false` you will still need to implement the user endpoint so that auth can fetch the user information on e.g. page refresh.

### `clientId`

- Default: `false`

If your backend requires client id, it can be set here.

### `grantType`

- Default: `false`

If your backend requires grant type, it can be set here.

### `scope`

- Default: `false`

If your backend requires scope, it can be set here.
