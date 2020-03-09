# Local

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/schemes/local.js)

`local` is the default, general purpose authentication scheme, supporting `Cookie` and `JWT` login flows.

By default `local` scheme is enabled and preconfigured. You can set `strategies.local` to `false` to disable it.

## Usage

To do a password based login by sending credentials in request body as a JSON object:

```js
<template>
  <div>
    <form @submit="userLogin">
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
        email: '',
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


## Options

Example for a token based flow:

```js
auth: {
  strategies: {
    local: {
      endpoints: {
        login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/api/auth/logout', method: 'post' },
        user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
      },
      // tokenRequired: true,
      // tokenType: 'bearer'
      // autoFetchUser: true
    }
  }
}
```

Example for a cookie based flow:

```js
auth: {
  strategies: {
    local: {
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
      },
      tokenRequired: false,
      tokenType: false
    }
  }
}
```

### `endpoints`

Each endpoint is used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

::: tip
To disable each endpoint, simply set its value to `false`.
:::

#### `propertyName`

`propertyName` can be used to specify which field of the response JSON to be used for value. It can be `false` to directly use API response or being more complicated like `auth.user`.

### `tokenRequired`

This option can be used to disable all token handling. Useful for Cookie only flows. \(Enabled by default\)

### `tokenName`

- Default: `Authorization`

  Authorization header name to be used in axios requests.

### `tokenType`

- Default: `Bearer`

 Authorization header type to be used in axios requests.
 
 ### `autoFetchUser`
 
 - Default: `true`
 
 This option can be used to disable user fetch after login. It is useful when your login response already have the user.
