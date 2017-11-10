# Auth

[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/auth/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/auth.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/auth-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/auth-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/auth-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/auth-module)
[![Dependencies](https://david-dm.org/nuxt-community/auth-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/auth-module)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

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
    },
    login: {
      endpoint: 'auth/login',
    },
    logout: {
      endpoint: 'auth/logout',
      method: 'GET',
    },
    redirect: {
      notLoggedIn: '/login',
      loggedIn: '/'
    },
    token: {
      enabled: true,
      name: 'token',
      cookieName: 'token',
      type: 'Bearer'
    }
}
```

## Options

#### user
Sets the global settings for store **fetch** action.
* **endpoint** - Set the URL of the user data endpoint. It can be a relative or absolute path.
* **propertyName** - Set the name of the return object property that contains the user data. If you want the entire object returned, set an empty string.

#### login
Set the global settings for store **login** action.
* **endpoint** - Set the URL of the login endpoint. It can be a relative or absolute path.

#### logout
Sets the global settings for store **logout** action.
* **endpoint** - Set the URL of the logout endpoint. It can be a relative or absolute path.
* **method** - Set the request to POST or GET.

#### Token
* **enabled** - Get and use tokens for authentication.
* **name** - Set the token name in the local storage.
* **cookieName** - Set the token name in Cookies. (Set to `null` to disable)
* **type** - Sets the token type of the authorization header.

#### redirect
* **notLoggedInRedirectTo** - Sets the redirect URL default of the users not logged in. Only when `auth` middleware is added to a page.
* **loggedInRedirectTo** - Sets the redirect URL default of the users logged in. Only when `no-auth` middleware is added to a page.

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
    'auth', // If user not logged in, redirect to '/login' or to URL defined in redirect property
    'no-auth' // If user is already logged in, redirect to '/' or to URL defined in redirect property
  ]
}
```

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community
