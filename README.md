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

Logout:

```js
this.$auth.logout()
```

Get token:

```js
this.$auth.token
```

Get user object:

```js
// Using $auth
this.$auth.state.user

// Using $store
this.$store.state.auth.user
```

Get login status:

```js
// Using $auth
this.$auth.state.loggedIn

// Using $store
this.$store.state.auth.loggedIn
```


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

See [defaults.js](lib/defaults.js) file for default options.

### `fetchUserOnLogin`
- Default: `true`

If enabled, user will be auto fetched after login.

### `resetOnError`
- Default: `true`

If enabled, user will be automatically logged out if any error happens. (For example when token expired)

### `namespace`
- Default: `auth`

Vuex store namespace for keeping state.

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

Redirect paths, after for authenticated and non-authenticated routes. Each can be disabled by setting to `false`.

### `token`
Default:
```js
token: {
  type: 'Bearer',
  name: 'token'.
}
```

* **type** - Authotization header type to be used in axios requests.
* **name** - Token name to be stored in **localtorage**. Can be disabled by setting to `false`.

### `cookie`
Default:
```js
cookie: {
  name: 'token',
  params: {
    path: '/'
  }
}
```

Using cookies is **REQUIRED** for SSR requests working with JWT authentication.
It can be disabled by setting `cookie` to `false`.

* **name**: Cookie name,
* **params** Cookie params.
  * `params.expires` can be used to speficy cookie lifetime in seconds. Default is session only.

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community
