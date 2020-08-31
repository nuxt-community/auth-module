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

When using middleware globally you can override the middleware checks per component route. You can set `auth` option to `false` in a specific component and the global middleware will ignore that route.

```js
export default {
  auth: false
}
```

You can set `auth` property to `guest` in your component. When this middleware is enabled on a route and `loggedIn` is `true` user will be redirected to `redirect.home` route. (`/` by default). When using the `redirect.callback` options please make sure you set the component property `auth` to `false` on the callback page component.

```js
export default {
  auth: 'guest'
}
```
