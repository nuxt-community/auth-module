---
title: Setup
description: 'Zero-boilerplate authentication support for Nuxt.js!'
position: 2
category: Guide
---

- [Installation](#installation)
- [Using with TypeScript](#using-with-typescript)

## Installation

<alert type="info">

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

</alert>

Add `@nuxtjs/auth-next @nuxtjs/axios` dependencies to your project:

<code-group>
  <code-block label="yarn" active>

  ```bash
  yarn add --exact @nuxtjs/auth-next
  yarn add @nuxtjs/axios
  ```

  </code-block>
  <code-block label="npm">

  ```bash
  npm install --save-exact @nuxtjs/auth-next
  npm install @nuxtjs/axios
  ```

  </code-block>
</code-group>

Then, add `@nuxtjs/auth-next` to the `modules` section of `nuxt.config.js`:

```js{}[nuxt.config.js]
{
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  auth: {
    // Options
  }
}
```

<alert type="warning">

When adding `auth-module` to a new Nuxt project ensure you have [activated the Vuex store](https://nuxtjs.org/guide/vuex-store/#activate-the-store). More information on how to do that can be found on the [Nuxt Getting Started Guide](https://nuxtjs.org/guides/directory-structure/store).

</alert>

## Using with TypeScript

<alert type="info">

For more information about using TypeScript in your Nuxt.js project, visit the [Nuxt Typescript documentation](https://typescript.nuxtjs.org/).

</alert>

Add `@nuxtjs/auth-next` to the `compilerOptions.types` section of your project's `tsconfig.json` file:

```json{}[tsconfig.json]
{
  compilerOptions: {
    "types": [
      "@nuxtjs/auth-next",
    ]
  },
}
```

<alert type="warning">

If you still receive errors after installing the types package, it may be necessary to restart your code editor so that the new types are recognized.

</alert>
