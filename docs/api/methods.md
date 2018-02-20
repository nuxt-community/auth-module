# Auth Methods

> You can all auth methods anywhere that `this` or `context.app` is available using `$auth`.

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

> Using `loginWith` is recommended instead of this function!

```js
this.$auth.login(/* .... */)
  .then(() => this.$toast.success('Logged In!'))
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

### `setToken(token[,name])`

Universally set token. The `name` parameter is optional and defaults to `options.token.name`.

```js
// Update token
this.$auth.setToken('123')
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

## State utilities

### Universal Storage

```js
this.$auth.setUniversal(key, val, options)
this.$auth.getUniversal(key)
this.$auth.syncUniversal(key)
```

### Local State

```js
this.$auth.setState(key, val)
this.$auth.getState(key)

// Watch state changes
this.$auth.watchState('loggedIn', newValue => { })

```

### Cookies

```js
this.$auth.setCookie(key, val, options)
this.$auth.getCookie(key)
```

### Local Storage

```js
this.$auth.setLocalstorage(key, val, options)
this.$auth.getLocalstorage(key)
```
