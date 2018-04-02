# Auth Middleware

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

👉 Now you have to configure some [Strategies](schemes/README.md) for auth.
