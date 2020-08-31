---
title: Middleware
description: 'You can enable `auth` middleware either globally or per route.'
position: 3
category: Guide
---

You can enable `auth` middleware either globally or per route.
When this middleware is enabled on a route and `loggedIn` is `false` user will be redirected to `redirect.login` route. (`/login` by default)

Setting per route:

```js
export default {
  middleware: 'auth'
}
```

Globally setting in `nuxt.config.js`:

```js{}[nuxt.config.js]
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

You can set `auth` option to `guest` in a specific component. When this middleware is enabled on a route and `loggedIn` is `true` user will be redirected to `redirect.home` route. (`/` by default)

```js
export default {
  auth: 'guest'
}
```
