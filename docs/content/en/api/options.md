---
title: options
description: General options shared with all strategies. See defaults.ts for defaults.
position: 52
category: API
---

General options shared with all strategies. See moduleDefaults in [options.ts](https://github.com/nuxt-community/auth-module/blob/dev/src/options.ts) for defaults.

## `redirect`

Default:

```js
auth: {
  redirect: {
    login: '/login',
    logout: '/',
    callback: '/login',
    home: '/'
  }
}
```

* `login`: User will be redirected to this path if *login is required*.
* `logout`: User will be redirected to this path if *after logout, current route is protected*.
* `home`: User will be redirected to this path *after login*. (`rewriteRedirects` will rewrite this path)
* `callback`: User will be redirected to this path by the identity provider *after login*. (Should match configured `Allowed Callback URLs` (or similar setting) in your app/client with the identity provider)

Each redirect path can be disabled by setting to `false`.
Also you can disable all redirects by setting `redirect` to `false`

## `watchLoggedIn`

- Default: `true`

When enabled (default) user will be redirected on login/logouts.

## `token`

Auth tokens are stored in various storage providers (cookie, localStorage, vuex) on user login to provide a seamless auth experience across server-side rendering (SSR) and client-side rendering. Tokens are stored under with storage keys of the format: `{storageProvider.prefix}{token.prefix}{strategy}`. See [auth.ts - Token helpers](https://github.com/nuxt-community/auth-module/blob/dev/src/core/auth.ts#L160) and [storage.ts](https://github.com/nuxt-community/auth-module/blob/dev/src/core/storage.ts) for more details.

Default:

```js
auth: {
  token: {
    prefix: '_token.'
  }
}
```

* **prefix** - Default prefix used in building a key for token storage across all storage providers.

## `localStorage`

Default:

```js
auth: {
  localStorage: {
    prefix: 'auth.'
  }
}
```

* **prefix** - Default token prefix used in building a key for token storage in the browser's localStorage.

You can disable use of localStorage by setting `localStorage` to `false`, like so:

```js
auth {
  localStorage: false
}
```

Otherwise the auth token will be stored in localStorage at a default key of: `auth._token.{provider}`.

## `cookie`

Default:

```js
auth: {
  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  }
}
```

* **prefix** - Default token prefix used in building a key for token storage in the browser's localStorage.
* **options** - Additional cookie options, passed to [cookie](https://www.npmjs.com/package/cookie).
  * `path` - path where the cookie is visible. Default is '/'.
  * `expires` - can be used to specify cookie lifetime in `Number` of days or specific `Date`. Default is session only.
  * `maxAge` - Specifies the number (in seconds) to be the value for the `Max-Age` (preferred over `expires`)
  * `domain` - domain (and by extension subdomain/s) where the cookie is visible. Default is domain and all subdomains.
  * `secure` - sets whether the cookie requires a secure protocol (https). Default is false, **should be set to true if possible**.

Note: Using cookies is effectively **required** for univeral mode (SSR) apps because authentication on first page load occurs **only** on the server side and local storage is not available on the server.

You can disable use of cookie storage by setting `cookie` to `false`, like so:

```js
auth: {
  cookie: false
}
```

Otherwise the auth token will be stored in a cookie named by default as: `auth._token.{provider}`.

## `plugins`

If you have any nuxt plugin that depends on `$auth` you have to specify it here instead of top-level `plugins` option in `nuxt.config.js`.

See [Extending Auth Plugin](/recipes/extend)

## `resetOnError`

* Default: `false`

Either a boolean or a function is accepted. If a function is passed, it will take the same arguments as `onError` handlers and return `Boolean` to inform whether a reset should be performed.

If enabled, user will be automatically logged out if an error happens. (For example when token expired)

## `rewriteRedirects`

* Default: `true`

If enabled, user will redirect back to the original guarded route instead of `redirect.home`.

## `fullPathRedirect`

Default: `false`

If true, use the full route path with query parameters for redirect

## `vuex.namespace`

* Default: `auth`

Vuex store namespace for keeping state.

## `scopeKey`

* Default: `scope`

`user` object property used for scope checking (`hasScope`). Can be either an array or a object.
