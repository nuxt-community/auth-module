---
title: 中间件
description: '您可以通过全局或按路由启用中间件'
position: 3
category: Guide
---

你可以启用 `auth` 中间件，可以是全局的，也可以是按照路由的。
当这个中间件在路由 `loggedIn` 是 `false` 用户将被重定向到
`redirect.login` 路由中. (在默认情况下是 `/login` 路由)

每个路由的设置:

```js
export default {
  middleware: 'auth'
}
```

在全局内容中设置 `nuxt.config.js`:

```js{}[nuxt.config.js]
router: {
  middleware: ['auth']
}
```

在全局中使用可以设置 `auth` 参数为 `false` 在特定的组件中，中间件会忽略该路由。

```js
export default {
  auth: false
}
```

可以设置 `auth` 选项到 `guest` 在特定组件中。当这个中间件在路由和 `loggedIn` 是 `true` 是，用户将被重定向到 `redirect.home` 路由中. (`/` 是默认的)

```js
export default {
  auth: 'guest'
}
```
