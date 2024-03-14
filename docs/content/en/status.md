---
title: Status
description: ''
position: 2
category: ''
---

Auth module has two major versions to choose from:

## `@nuxtjs/auth-next` (v5)

This package has more documentation, features and many fixes landed but it's API is still in flux. (current docs)

We recommend that you use v5 via `@nuxtjs/auth-next`

However, you should fix your `package.json` to the _exact_ version of `auth-next` that you develop
with to avoid updating with breaking changes since package is auto published.

## `@nuxtjs/auth` (v4)

This package is stable in regards of options and behavior but is missing many key improvements and may contain bugs.

Please see [nuxt-community/auth-module#893](https://github.com/nuxt-community/auth-module/issues/893) for more context.

## Nuxt 3 Suppport

Nuxt 3 comes with built-in utilities to support session and authentication. We are working on a new official module. Meanwhile, we recommend: 

- [auth starter template](https://github.com/nuxt/examples/tree/main/examples/auth/local) for Nuxt 3
- [sidebase nuxt auth](https://sidebase.io/nuxt-auth/getting-started) powered by Auth.js
