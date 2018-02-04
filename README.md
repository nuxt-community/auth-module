<h1 align="center">🔑 Auth</h1>

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
    '@nuxtjs/axios',
    '@nuxtjs/auth'
 ],

 auth: {
   // Options
 }
```

See [Options](#options) section for all available options

<h2 align="center">Usage</h2>

Do a password based login:

```js
this.$auth.login({
  data: {
    username: 'your_username',
    password: 'your_password'
  }
})
```

`user` object:

```js
// Access using $auth (reactive)
this.$auth.state.user

// Access using $store (reactive)
this.$store.state.auth.user

// Refetch user
this.$auth.fetchUser()
```

`loggedIn` status:

```js
// Access using $auth (reactive)
this.$auth.state.loggedIn

// Access using $store (reactive)
this.$store.state.auth.loggedIn

// Do logout
this.$auth.logout()
```

Check if user has a speficic scope:

```js
// Returns is a computed boolean
this.$auth.hasScope('admin')
```

Auth token:

```js
// Access token (reactive)
this.$auth.token

// Update token
this.$auth.setToken('123')
```

Listen for auth errors: (`plugins/auth.js`)

```js
export default function({ $auth }) {
  $auth.onError((error, name, endpoint) => {
    console.error(name, error)
  })
}
```

Working with low level state: (Not recommended)

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

<h2 align="center">Auth Middleware</h2>

You can enable `auth` middleware either globally or per route.
When this middleware is enabled on a route and `loggedIn` is `false` user will be redirected to `redirect.login` route. (`/login` by default)

Setting per route:

```js
export default {
  middleware: 'auth'
}
```

Globally setting in `nuxt.config.js`:

```js
router: {
  middleware: ['auth']
}
```

In case of global usage, You can set `auth` option to `false` in a specific component and the middleware will ignore that route.

```js
export default {
  auth: false
}
```

<h2 align="center">Options</h2>

See [defaults.js](lib/defaults.js) for defaults.

### `endpoints`

Default:

```js
endpoints: {
  login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
  logout: { url: '/api/auth/logout', method: 'post' },
  user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
}
```

Endpoints used to make requests using axios. They are basically extending Axios [Request Config](https://github.com/axios/axios#request-config).

`propertyName` can be used to specify which field of the response to be used for value. It can be `undefined` to directly use API response or being more complicated like `auth.user`.

To disable each endpoint, simply set it's value to `false`.

### `redirect`

Default:

```js
redirect: {
  login: '/login',
  home: '/'
},
```

Redirect paths to redirect user after login and logout. Each can be disabled by setting to `false`.

### `token`

Default:

```js
token: {
  type: 'Bearer',
  name: 'token'.
}
```

* **type** - Authotization header type to be used in axios requests.
* **name** - Token name to be stored in Browser localStorage. It can be disabled by setting to `false`.

### `cookie`

Default:

```js
cookie: {
  name: 'token',
  options: {
    path: '/'
  }
}
```

Using cookies is **required** for SSR requests to work with JWT tokens.

It can be disabled by setting `cookie` to `false`.

* **name** - Cookie name.
* **options** - Cookie options.
  * `options.expires` can be used to speficy cookie lifetime in days. Default is session only.

### `fetchUserOnLogin`

* Default: `true`

If enabled, user will be auto fetched after login.

### `resetOnError`

* Default: `false`

If enabled, user will be automatically logged out if any error happens. (For example when token expired)

### `rewriteRedirects`

* Default: `true`

If enabled, user will redirect back to the original guarded route instead of `redirects.home`.

### `watchLoggedIn`

* Default: `true`

If enabled, user will automatically redirected to `redirects.home` after login/logout.

### `namespace`

* Default: `auth`

Vuex store namespace for keeping state.

### `scopeKey`

* Default: `scope`

`user` object proprty used for scope checkings (`hasScope`). Can be either an array or a object.

## License

[MIT License](./LICENSE) - Copyright (c) Nuxt Community
