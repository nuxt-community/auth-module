# Reactive properties

All properties are reactive. Meaning that you can safely use them in Vue template `v-if` conditions.

## `user`

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

## `loggedIn`

This boolean flag indicates that user is authenticated and available at the moment or not.

```js
// Access using $auth
this.$auth.state.loggedIn

// Access using $store
this.$store.state.auth.loggedIn
```

## `token`

Keeps the token. For security reasons, token is kept outside of Vuex store.

```js
// Access token
this.$auth.token
```
