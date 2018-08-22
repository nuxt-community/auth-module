# Migration Guide

> The best reference to upgrade or getting started are [Docs](https://auth.nuxtjs.org/) and [Demo example](https://github.com/nuxt-community/auth-module/).

## From 4.0.0-rc.3 to 4.0.0

### Multi strategy

- You have to move `auth.endpoints` into `auth.strategies.local.endpoints`:

```diff
auth: {
+ strategies: {
    local: {
      endpoints: {
        // ...
      }
    }
+ }
}
```

- For choosing login strategy a new method `$auth.loginWith(provider[,options])` is available. 

### State access

- The `$auth.user` and `$auth.loggedIn` reactive properties are the recommended way to access user info.

- For low-level state you can use `$auth.$storage`.

- Token can be retrieved using `$auth.getToken(provider)`.

### Plugins depending on $auth

If you have any plugin that needs extending `$auth` you have to pass it into `auth.plugins[]` option instead of top level `plugins[]` inside `nuxt.config.js`.

### Option changes

Please refer to the new docs.

## From 3.x to 4.x
4.x is a new rewrite of Auth module. This release introduces some new features but also includes breaking changes with both usage and options, this guide will allow you to easily upgrade from 3.x to 4.x

### Behavioural changes
 - The module now watches any changes from `loggedIn` and automatically redirects users on login and logout.

**NOTE :** *User will be redirected using `login` and `home` from `redirect` options*

### Migration example
Any store actions should be replaced with new global `$auth` instance. The best reference is official Docs for new usage.

If you were using promise acceptance to redirect users after login and logout like this:

```js
// Login example
store.dispatch('auth/login', {
  fields: {
    username: 'your_username',
    password: 'your_password'
  }
}).then(() => this.$router.replace('/'))

// Logout example
store.dispatch('auth/logout').then(() => this.$router.replace('/login'))
```

Now you can do this:

```js
// Login example
this.$auth.login({
  data: {
    username: 'your_username',
    password: 'your_password'
  }
})

// Logout example
this.$auth.logout()
```


### Middleware changes
 - `auth` middleware  now manages both authenticated and unauthenticated user redirection
 - `no-auth` middleware have been **removed** and merged into `auth` middleware

### Migration example

#### Authenticated and unauthenticated redirection

If you were using the following configuration in 3.x :
```js
// nuxt.config.js
router: {
  middleware: [
    'auth',
    'no-auth'
  ]
}
```

This is the corresponding configuration in 4.x :
```js
// nuxt.config.js
router: {
  middleware: [
    'auth',
  ]
}
```

#### Unauthenticated redirection only
If you were using the following configuration in 3.x :
```js
// nuxt.config.js
router: {
  middleware: [
    'auth',
  ]
}
```

This is the corresponding configuration in 4.x :
```js
// nuxt.config.js
auth: {
  redirect: {
    login: false
  }
},
router: {
  middleware: [
    'auth',
  ]
}
```
#### Authenticated redirection only
If you were using the following configuration in 3.x :
```js
router: {
  middleware: [
    'no-auth',
  ]
}
```

This is the corresponding configuration in 4.x :
```js
// nuxt.config.js
auth: {
  redirect: {
    home: false
  }
},
router: {
  middleware: [
    'auth',
  ]
}
```
