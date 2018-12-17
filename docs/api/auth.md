# $auth

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/core/auth.js)

This module globally injects `$auth` instance, meaning that you can access it anywhere using `this.$auth`.
For plugins, asyncData, fetch, nuxtServerInit and Middleware, you can access it from `context.app.$auth`.

## properties

All properties are reactive. Meaning that you can safely use them in Vue template `v-if` conditions.

## `user`

This object contains details about authenticated user such as name. 
You can access it using either `$auth` or Vuex.

```js
// Access using $auth
this.$auth.user

// Access using vuex
this.$store.state.auth.user
```

## `loggedIn`

This boolean flag indicates that user is authenticated and available at the moment or not.

```js
// Access using $auth
this.$auth.loggedIn

// Access using vuex
this.$store.state.auth.loggedIn
```

Under the hood, auth uses attached [`$storage`](./storage.md) instance to provide this states.


## methods

### `loginWith(strategyName, ...args)`

- Returns: `Promise`

Set current strategy to `strategyName` and try to do login. Usage varies by current strategy.

```js
this.$auth.loginWith('local', /* .... */)
  .then(() => this.$toast.success('Logged In!'))
```

### `login(...args)`

- Returns: `Promise`

Login using active strategy. Usage varies by current strategy.

> **TIP:** Using `loginWith` is recommended instead of this function!

```js
this.$auth.login(/* .... */)
  .then(() => this.$toast.success('Logged In!'))
```

### `setUserToken(token)`

- Returns: `Promise`

Set the auth token and fetch the user using the new token and current strategy. 

> **TIP:** This function can properly set the user after registration

```js
this.$auth.setUserToken(token)
  .then(() => this.$toast.success('User set!'))
```

## `logout()`

- Returns: `Promise`

Logout active strategy. Usage varies by current scheme.

```js
await this.$auth.logout()
```

## `fetchUser()`

- Returns: `Promise`

Force re-fetch user using active strategy.

```js
await this.$auth.fetchUser()
```

## `hasScope(scopeName)`
Check if user has a specific scope:

```js
// Returns is a computed boolean
this.$auth.hasScope('admin')
```

### `setToken(strategy, token)`

Universally set token. The `name` parameter is optional and defaults to `options.token.name`.

```js
// Update token
this.$auth.setToken('local', '.....')
```

### `onError(handler)`

Listen for auth errors: (`plugins/auth.js`)

```js
export default function({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    console.error(name, error)
  })
}
```
