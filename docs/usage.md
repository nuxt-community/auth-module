# Usage

## Reactive Properties 

### `user`

This object contains details about authenticated user such as name. 
You can access it using either `$auth` or Vuex.

```js
// Access using $auth
this.$auth.state.user

// Access using $store
this.$store.state.auth.user

// Refetch user
this.$auth.fetchUser()
```

### `loggedIn`

This boolean flag indicates that user is authenticated and available at the moment or not.
You can use it in Vue template `v-if` conditions.

```js
// Access using $auth
this.$auth.state.loggedIn

// Access using $store
this.$store.state.auth.loggedIn
```

### `token`

Keeps the token. For security reasons, token is kept outside of Vuex store.

```js
// Access token
this.$auth.token
```

## Methods

### `logout`

Logs out the user and returns a Promise.

```js
this.$auth.logout()
```

## `hasScope`
Check if user has a speficic scope:

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

```js
// Store
this.$auth.setState(key, val)
this.$auth.getState(key)

// Watch state changes
this.$auth.watchState('loggedIn', newValue => { })

// Cookie
this.$auth.setCookie(key, val, options)
this.$auth.getCookie(key)

// LocalStorage
this.$auth.setLocalstorage(key, val, options)
this.$auth.getLocalstorage(key)
```
