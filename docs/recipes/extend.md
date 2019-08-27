# Extending Auth plugin

If you have plugins that need to access `$auth`, you can use `auth.plugins` option.

`nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/auth'
  ],
  auth: {
     plugins: [ '~/plugins/auth.js' ]
  }
}
```

`plugins/auth.js`

```js
export default function ({ app }) {
  if (!app.$auth.loggedIn) {
    return
  }

  const username = app.$auth.user.username
}
```

For example (with SSR), if you need to make sure all instances of `axios` are configured:

```js
{
  modules: [
    '@nuxtjs/auth'
  ],
  auth: {
     plugins: [ { src: '~/plugins/axios', ssr: true }, '~/plugins/auth.js' ]
  }
}
```
