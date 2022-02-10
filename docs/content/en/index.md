---
title: Introduction
description: 'Zero-boilerplate authentication support for Nuxt.js!'
position: 1
category: ''
---

<img src="/preview.png" class="light-img" />
<img src="/preview-dark.png" class="dark-img" />

Auth Module for [NuxtJS](https://nuxtjs.org).

Zero-boilerplate authentication support for Nuxt.js!

The module authenticates users using a configurable authentication [scheme](/guide/scheme) or by using one of the directly supported [providers](/guide/provider). It provides an [API](https://auth.nuxtjs.org/) for triggering authentication and accessing resulting user information. While it takes care of [storing](/api/storage) the information on the client-side, it does NOT implement session handling or provide session based authentication on the NuxtJS server.

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
