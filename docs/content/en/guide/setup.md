---
title: Setup
description: 'Zero-boilerplate authentication support for Nuxt.js!'
position: 2
category: Guide
---

Check the [Nuxt.js documentation](https://nuxtjs.org/guides/configuration-glossary/configuration-modules) for more information about installing and using modules in Nuxt.js.

## Installation


<alert type="warning">

This docs are for next version of nuxt-auth module which is unstable. Use with caution!

</alert>

Add `@nuxtjs/auth-next @nuxtjs/axios` dependencies to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add @nuxtjs/auth-next @nuxtjs/axios
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install @nuxtjs/auth-next @nuxtjs/axios
  ```

  </code-block>
</code-group>

Then, add `@nuxtjs/xxx` to the `modules` section of `nuxt.config.js`:

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

IMPORTANT
When adding `auth-module` to a new Nuxt project ensure you have [activated the Vuex store](https://nuxtjs.org/guide/vuex-store/#activate-the-store). More information on how to do that can be found on the [Nuxt Getting Started Guide](https://nuxtjs.org/guides/directory-structure/store).

</alert>
