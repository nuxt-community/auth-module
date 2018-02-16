# Auth Methods

> You can all auth methods anywhere that `this` or `context.app` is available using `$auth`.

### `login`

- Returns: `Promise`

Login using active strategy. Usage varies by current scheme.

```js
this.$auth.login(/* .... */)
  .then(() => this.$toast.success('Logged In!'))
```

## `logout`

- Returns: `Promise`

Logout active strategy. Usage varies by current scheme.

```js
await this.$auth.logout()
```

## `fetchUser`

- Returns: `Promise`

Force re-fetch user using active strategy.

```js
await this.$auth.fetchUser()
```

## `hasScope`
Check if user has a specific scope:

```js
// Returns is a computed boolean
this.$auth.hasScope('admin')
```

### `setToken`

Set token in all neccessary places including Vuex, local state, localStorage and Axios headers.

```js
// Update token
this.$auth.setToken('123')
```

### `onError`

Listen for auth errors: (`plugins/auth.js`)

```js
export default function({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    console.error(name, error)
  })
}
```

## State utilities


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
