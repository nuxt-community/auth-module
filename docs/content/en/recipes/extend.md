---
title: Extending Auth plugin
description: If you have plugins that need to access `$auth`, you can use `auth.plugins` option.
position: 41
category: Recipes
---

If you have plugins that need to access `$auth`, you can use `auth.plugins` option.

```js{}[nuxt.config.js]
{
  modules: [
    '@nuxtjs/auth'
  ],
  auth: {
     plugins: [ '~/plugins/auth.js' ]
  }
}
```

```js{}[plugins/auth.js]
export default function ({ $auth }) {
  if (!$auth.loggedIn) {
    return
  }

  const username = $auth.user.username
}
```

For example (with SSR), if you need to make sure all instances of `axios` are configured:

```js{}[nuxt.config.js]
{
  modules: [
    '@nuxtjs/auth'
  ],
  auth: {
     plugins: [ { src: '~/plugins/axios', ssr: true }, '~/plugins/auth.js' ]
  }
}
```
