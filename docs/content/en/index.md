---
title: Introduction
description: 'Zero-boilerplate authentication support for Nuxt.js!'
position: 1
category: ''
---

<img src="/preview.png" class="light-img" />
<img src="/preview-dark.png" class="dark-img" />

Auth Module for [Nuxt 2](https://v2.nuxt.com).

Zero-boilerplate authentication support for Nuxt 2!

The module authenticates users using a configurable authentication [scheme](/guide/scheme) or by using one of the directly supported [providers](/guide/provider). It provides an [API](https://auth.nuxtjs.org/) for triggering authentication and accessing resulting user information. While it takes care of [storing](/api/storage) the information on the client-side, it does NOT implement session handling or provide session based authentication on the NuxtJS server.

## Nuxt 3 Support

Nuxt 3 comes with built-in utilities to support session and authentication. We are working on a new official module. 

Meanwhile, we recommend:

- [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils)
- [Sidebase Nuxt Auth](https://github.com/sidebase/nuxt-auth) based on next-auth
- [AuthJs Nuxt](https://github.com/Hebilicious/authjs-nuxt) based on Auth.js
- Implement your own auth using [Lucia](https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nuxt/) or [Nuxt Auth Template](https://github.com/nuxt/examples/tree/main/auth/local)

## Getting Started

If it is first time using this module, reading resources below in order is recommended:

1. [Add auth and axios modules](./guide/setup)
2. [Setup auth middleware](./guide/middleware)
3. [Configure local scheme](./schemes/local)
4. [Customize options](./api/options)
5. [Use `$auth` service](./api/auth)

You can also watch a video introduction by VueScreencasts. It covers the same material, but in the context of a working Nuxt app.

[![Nuxt Auth - Authentication and Authorization in NuxtJS](https://img.youtube.com/vi/zzUpO8tXoaw/0.jpg)](https://youtu.be/zzUpO8tXoaw)

## More Resources

- [Glossary](./glossary)
- [GitHub](https://github.com/nuxt-community/auth-module)
- [Releases](https://github.com/nuxt-community/auth-module/releases)
- [Examples](https://github.com/nuxt-community/auth-module/tree/dev/demo)
- [Demo](https://nuxt-auth.herokuapp.com)
