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

::: warning IMPORTANT
When adding `auth-module` to a new Nuxt project ensure you have [activated the Vuex store](https://nuxtjs.org/guide/vuex-store/#activate-the-store). More information on how to do that can be found on the [Nuxt Getting Started Guide](https://nuxtjs.org/guide/vuex-store).
:::


### Typescript setup

Add the types to your "types" array in tsconfig.json after the `@nuxt/vue-app` entry

**tsconfig.json**

```json
{
  "compilerOptions": {
    "types": [
      "@nuxt/vue-app",
      "@nuxtjs/auth"
    ]
  }
}
```
> **Why?**
>
> Because of the way nuxt works the `$axios` property on the context has to be merged into the nuxt `Context` interface via [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html). Adding `@nuxtjs/auth` to your types will import the types from the package and make typescript aware of the additions to the `Context` interface.
