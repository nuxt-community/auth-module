# Auth Module

[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/auth/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/auth.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/auth-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/auth-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/auth-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/auth-module)
[![Dependencies](https://david-dm.org/nuxt-community/auth-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/auth-module)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

> Authentication module for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Setup
- Add `@nuxtjs/auth` dependency using yarn or npm to your project
- Add `@nuxtjs/auth` and `@nuxtjs/axios` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/auth',

     // ...Axios module should be included AFTER @nuxtjs/auth
    '@nuxtjs/axios'
 ],
 // Default Values
 auth: {
    user: {
      endpoint: 'auth/user',
      propertyName: 'user',
      resetOnFail: true,
      enabled: true,
      method: 'GET',
    },
    login: {
      endpoint: 'auth/login',
    },
    logout: {
      endpoint: 'auth/logout',
      method: 'GET',
    },
    redirect: {
      guest: true,
      user: true,
      notLoggedIn: '/login',
      loggedIn: '/'
    },
    token: {
      enabled: true,
      type: 'Bearer',
      localStorage: true,
      name: 'token',
      cookie: true,
      cookieName: 'token'
    }
}
```

## Options

#### user
Sets the global settings for store **fetch** action.
* **endpoint** - Set the URL of the user data endpoint. It can be a relative or absolute path.
* **propertyName** - Set the name of the return object property that contains the user data. If you want the entire object returned, set an empty string.
* **resetOnFail** - Automatically invalidate all tokens if user fetch fails. (Default is `true`)
* **method** - Set the request to POST or GET.

#### login
Set the global settings for store **login** action.
* **endpoint** - Set the URL of the login endpoint. It can be a relative or absolute path.

#### logout
Sets the global settings for store **logout** action.
* **endpoint** - Set the URL of the logout endpoint. It can be a relative or absolute path.
* **method** - Set the request to POST or GET.

#### token
* **enabled** (Boolean) - Get and use tokens for authentication.
* **type** - Sets the token type of the authorization header.
* **localStorage**(Boolean) - Keeps token in local storage, if enabled.
* **name** - Set the token name in the local storage.
* **cookie** (Boolean) - Keeps token in cookies, if enabled.
* **cookieName** - Set the token name in Cookies.

#### redirect
* **guest** (Boolean) - Sets if the middleware should redirect guests users (unauthenticated). Only when `auth` middleware is added to a page.
* **user** (Boolean) - Sets if the middleware should redirect logged users (authenticated). Only when `auth` middleware is added to a page.
* **notLoggedIn** (Boolean)  - Sets the redirect URL default of the users not logged in. Only when `auth` middleware is added to a page.
* **loggedIn** (Boolean) - Sets the redirect URL default of the users logged in. Only when `auth` middleware is added to a page.



## Example usage

```js
// ... code ...
// Do a password based login
store.dispatch('auth/login', {
  fields: {
    username: 'your_username',
    password: 'your_password'
  }
})

// ... code ...
store.dispatch('auth/logout') // run logout

// ... code ...
store.state.auth.token // get access token

// ... code ...
store.state.auth.user // get user data

// ... code ...
store.getters['auth/loggedIn'] // get login status (true or false)
```

## Middleware

```js
// ... in nuxt.config.js ...
router: {
  middleware: [
    'auth',
  ]
}
```

### Middleware Components Exclusion
You can set a `guarded` option to false in a specific component and the middleware will now ignore this component.
```js
export default {
  options: {
    guarded: false,
  }
}
```

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community
