# Setup

**IMPORTANT:** This docs are for next version of nuxt-auth module which is unstable. Use with caution!

Install with yarn:

```bash
yarn add @nuxtjs/auth-next @nuxtjs/axios
```

Install with npm:

```bash
npm install @nuxtjs/auth-next @nuxtjs/axios
```

Edit `nuxt.config.js`:

```js
modules: [
  '@nuxtjs/axios',
  '@nuxtjs/auth-next'
],

auth: {
  // Options
}
```

::: warning IMPORTANT
When adding `auth-module` to a new Nuxt project ensure you have [activated the Vuex store](https://nuxtjs.org/guide/vuex-store/#activate-the-store). More information on how to do that can be found on the [Nuxt Getting Started Guide](https://nuxtjs.org/guide/vuex-store).
:::
