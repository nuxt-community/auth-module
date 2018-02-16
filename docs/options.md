# Options

General options shared with all strategies. See [defaults.js](lib/defaults.js) for defaults.

### `redirect`

Default:

```js
redirect: {
  login: '/login',
  logout: '/'
  home: '/'
}
```

* `login`: User will be redirected to this path if *login is required*.
* `logout`: User will be redirected to this path if *after logout current route is protected*.
* `user`: User will be redirect to this path *after login*. (`rewriteRedirects` will rewrite this path)

Each redirect path can be disabled by setting to `false`.
Also you can disable all redirects by setting `redirect` to `false`

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

### `resetOnError`

* Default: `false`

If enabled, user will be automatically logged out if any error happens. (For example when token expired)

### `rewriteRedirects`

* Default: `true`

If enabled, user will redirect back to the original guarded route instead of `redirect.home`.

### `namespace`

* Default: `auth`

Vuex store namespace for keeping state.

### `scopeKey`

* Default: `scope`

`user` object proprty used for scope checkings (`hasScope`). Can be either an array or a object.

