---
title: auth
description: This module globally injects `$auth` instance, meaning that you can access it anywhere using `this.$auth`.
position: 51
category: API
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/core/auth.ts)

This module globally injects `$auth` instance, meaning that you can access it anywhere using `this.$auth`.
For plugins, asyncData, fetch, nuxtServerInit and Middleware, you can access it from `context.$auth`.

## properties

All properties are reactive. Meaning that you can safely use them in Vue template `v-if` conditions.

### `user`

This object contains details about authenticated user such as name.
You can access it using either `$auth` or Vuex.

```js
// Access using $auth
this.$auth.user

// Access using vuex
this.$store.state.auth.user
```

### `loggedIn`

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

Set current strategy to `strategyName` and attempt login. Usage varies by current strategy.

```js
this.$auth.loginWith('local', { data: { /* data to post to server */ } })
  .then(() => this.$toast.success('Logged In!'))
 
this.$auth.loginWith('google', { params: { /* additional authentication parameters */ } })
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

### `setUser(user)`

Set user data and update `loggedIn` state.

> **TIP:** This function can be used to set the user using the login response after a successfully login, when [autoFetchUser](../schemes/local.md#autofetchuser) is disabled.

```js
this.$auth.setUser(user)
```

### `setUserToken(token, refreshToken)`

- Returns: `Promise`

Set the auth token and optionally the refresh token, then it will fetch the user using the new token and current strategy.

> **TIP:** This function can properly set the user after registration

```js
this.$auth.setUserToken(token, refreshToken)
  .then(() => this.$toast.success('User set!'))
```

### `logout(...args)`

- Returns: `Promise`

Logout active strategy. Usage varies by current scheme.

```js
await this.$auth.logout(/* .... */)
```

### `fetchUser()`

- Returns: `Promise`

Force re-fetch user using active strategy.

```js
await this.$auth.fetchUser()
```

### `hasScope(scopeName)`

Check if user has a specific scope:

```js
// Returns is a computed boolean
this.$auth.hasScope('admin')
```

### `refreshTokens()`

Refreshes tokens if *refresh token* is available and not expired. This only works when logged in.

```js
// Refresh tokens
this.$auth.refreshTokens()
```

> **TIP:** Useful to manually refresh the token.

### `onError(handler)`

Listen for auth errors: (`plugins/auth.js`)

```js
export default function({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    console.error(name, error)
  })
}
```

### `onRedirect(handler)`

 Pre-process URLs before redirect: (`plugins/auth.js`)

 ```js
export default function({ $auth }) {
  $auth.onRedirect((to, from) => {
    console.error(to)
    // you can optionally change `to` by returning a new value
  })
}
```

## tokens

**Token** and **Refresh Token** are available on `$auth.token` and `$auth.refreshToken`.
Both have getters and setters and other helpers. Documented in [tokens.md](tokens.md)
