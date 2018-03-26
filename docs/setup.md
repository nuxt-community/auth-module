# Setup

Install with yarn:

```bash
yarn add @nuxtjs/auth @nuxtjs/axios
```

Install with npm:

```bash
npm install @nuxtjs/auth @nuxtjs/axios
```

Edit `nuxt.config.js`:

```js
modules: [
  '@nuxtjs/axios',
  '@nuxtjs/auth'
],

auth: {
  // Options
}
```

ℹ️ When adding `auth-module` to a new Nuxt project ensure you have activated the Vuex store. More information on how to do that can be found on the [Nuxt Getting Started Guide](https://www.google.com)

👉 You can now optionally configure [Auth Middleware](middleware.md) and some [https://nuxtjs.org/guide/vuex-store).
