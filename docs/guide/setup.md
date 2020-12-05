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

## Using with TypeScript

<alert type="info"> 

For more information about using TypeScript in your Nuxt.js project, visit the [Nuxt Typescript documentation](https://typescript.nuxtjs.org/).

</alert>

In order to use this module in a TypeScript project you will need to install the node package `@types/nuxtjs__auth`, which contains type definitions for the `@nuxtjs/auth` module. These type definitions can be found in the [DefinitelyTyped Github repository](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/nuxtjs__auth).

First, add `@types/nuxtjs__auth` as a dev dependency:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add -D @types/nuxtjs__auth
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install -D @types/nuxtjs__auth
  ```

  </code-block>
</code-group>

Then, add `@types/nuxtjs__auth` to the `compilerOptions.types` section of your project's `tsconfig.json` file:

```json{}[tsconfig.json]
{
  compilerOptions: {
    "types": [
      "@types/nuxtjs__auth",
    ]
  },
}
```

<alert type="warning"> 

IMPORTANT
If you still receive errors after installing the types package, it may be necessary to restart your code editor so that the new types are recognized.

</alert>
