<h1 align="center">Auth</h1>

<p align="center">Authentication module for Nuxt.js</p>

<p align="center">
<a href="https://david-dm.org/nuxt-community/auth-module">
    <img alt="" src="https://david-dm.org/nuxt-community/auth-module/status.svg?style=flat-square">
</a>
<a href="https://standardjs.com">
    <img alt="" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square">
</a>
<a href="https://circleci.com/gh/nuxt-community/auth-module">
    <img alt="" src="https://img.shields.io/circleci/project/github/nuxt-community/auth-module.svg?style=flat-square">
</a>
<a href="https://codecov.io/gh/nuxt-community/auth-module">
    <img alt="" src="https://img.shields.io/codecov/c/github/nuxt-community/auth-module.svg?style=flat-square">
</a>
<br>
<a href="https://npmjs.com/package/@nuxtjs/auth">
    <img alt="" src="https://img.shields.io/npm/v/@nuxtjs/auth/latest.svg?style=flat-square">
</a>
<a href="https://npmjs.com/package/@nuxtjs/auth">
    <img alt="" src="https://img.shields.io/npm/dt/@nuxtjs/auth.svg?style=flat-square">
</a>
</p>

[📖 **Release Notes**](./CHANGELOG.md)

If you are coming from an older release please be sure to read [Migration Guide](https://github.com/nuxt-community/auth-module/wiki/Migration-guide).

<h2 align="center">Setup</h2>

Install with yarn:

```bash
yarn add @nuxtjs/auth @nuxtjs/axios
```

Install with npm:

```bash
npm install @nuxtjs/auth @nuxtjs/axios
```

Edit `nuxt.config.js`:

```js
{
  modules: [
    '@nuxtjs/axios', // <-- Should be before @nuxtjs/auth
    '@nuxtjs/auth'
 ],

 auth: {
   // Options
 }
```

See [Options](#options) section for all available options

<h2 align="center">Auth Middleware</h2>

```js
// ... in nuxt.config.js ...
router: {
  middleware: [
    'auth',
  ]
}
```

### Components Exclusion

You can set a `guarded` option to false in a specific component and the middleware will ignore this component.

```js
export default {
  options: {
    guarded: false,
  }
}
```

<h2 align="center">Options</h2>

Check out [this](lib/defaults.js) file for default options.

### `user`
Sets the global settings for store **fetch** action.

`endpoint` - Set the URL of the user data endpoint. It can be a relative or absolute path.

`propertyName` - Set the name of the return object property that contains the user data. If you want the entire object returned, set an empty string.

`resetOnFail` - Automatically invalidate all tokens if user fetch fails.

`method` - Set the request to POST or GET.

### `login`
Set the global settings for store **login** action.

`endpoint` - Set the URL of the login endpoint. It can be a relative or absolute path.

### `logout`
Sets the global settings for store **logout** action.

`endpoint` - Set the URL of the logout endpoint. It can be a relative or absolute path.

`method` - Set the request to POST or GET.

### `token`

`enabled` - Get and use tokens for authentication.

`type` - Sets the token type of the authorization header.

`localStorage` - If set to `true`, Keeps token in local storage.

`name` - Set the token name in the local storage.

`cookie` - Keeps token in cookies, if enabled.

`cookieName` - Set the token name in Cookies.

### `redirect`

`guest` - Sets if the middleware should redirect guests users (unauthenticated). Only when `auth` middleware is added to a page.

`user` - Sets if the middleware should redirect logged users (authenticated). Only when `auth` middleware is added to a page.

`notLoggedIn` - Sets the redirect URL default of the users not logged in. Only when `auth` middleware is added to a page.

`loggedIn` - Sets the redirect URL default of the users logged in. Only when `auth` middleware is added to a page.

### `errorHandler`

`fetch`

- Type: `Function(context, error)`

Function will be called when fetch get an exception.

`logout`

- Type: `Function(context, error)`

Function will be called when logout get an exception.

<h2 align="center">Snippets</h2>

Do a password based login:

```js
this.$store.dispatch('auth/login', {
  fields: {
    username: 'your_username',
    password: 'your_password'
  }
})
```

Logout:

```js
this.$store.dispatch('auth/logout')
```

Get access token:

```js
console.log($store.state.auth.token)
```

Get user data:

```js
console.log($store.state.auth.user)
```

Get login status (Boolean):

```js
store.getters['auth/loggedIn']
```

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community
