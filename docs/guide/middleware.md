# Middleware

Within the Nuxt Auth module we provide an `auth` middleware out of the box for you. You can enable `auth` middleware either globally or per route.
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

You can set `auth` option to `guest` in a specific component. When this middleware is enabled on a route and `loggedIn` is `true` user will be redirected to `redirect.home` route. (`/` by default)

```js
export default {
  auth: 'guest'
}
```

## Accessing user data

With the user endpoints provided in some of the schemes you may access additional information in your middleware using `this.$auth.user`.

For example if the user endpoint provides additional information like so, you can 

```json
{
    "user":{
      "is_superadmin":true,
      "is_staff":true,
    }
}
```

You could now create a new middleware file such as `is_superadmin.js` with the following content:

```js
export default function ({ $auth, redirect }) {
  if ($auth.user.is_superadmin === false) {
    redirect('/')
  }
}
```

## Redirects using `$auth`

With Nuxt Auth we provide you additional redirects to some of the key pages defined in your auth configuration. So in addition to the context's `redirect` you can use:

use `login` redirect:
```js
export default function({ $auth }) {
  if ($auth.user.is_superadmin === false) {
    $auth.redirect('login')
  }
}
```
or use the `home` redirect:

```js
export default function({ $auth }) {
  if ($auth.user.is_superadmin === false) {
    $auth.redirect('home')
  }
}
```



