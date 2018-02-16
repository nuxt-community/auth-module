# Local Strategy

This is the default, general purpose authentication strategy, supporting `Cookie` and `JWT` login flows.

By default `local` strategy is enabled. You can set `strategies.local` to `false` to disable it.

```js
strategies: {
  local: {
    endpoints: {
      login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
      logout: { url: '/api/auth/logout', method: 'post' },
      user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
    }
  }
}
```

* `endpoints` used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).
  * `propertyName` can be used to specify which field of the response to be used for value. It can be `undefined` to directly use API response or being more complicated like `auth.user`.
  * To disable each endpoint, simply set it's value to `false`.

* Optional `tokenRequired` option can be used to disable all token handling. Useful for Cookie only flows. (Enabled by default)

#### Usage

Do a password based login by sending credentials in request body as a JSON object:

```js
this.$auth.login({
  data: {
    username: 'your_username',
    password: 'your_password'
  }
})
```
