> [!NOTE]
> This repository is archived. `@nuxtjs/auth` was built for Nuxt 2, which reached end of life on June 30, 2024. For Nuxt 3+, see [`nuxt-auth-utils`](https://github.com/atinux/nuxt-auth-utils).

<h1 align="center" >🔑 Auth Module</h1>
<p align="center">Zero-boilerplate authentication support for Nuxt 2!</p>

<p align="center">
<a href="https://david-dm.org/nuxt-community/auth-module">
    <img alt="" src="https://david-dm.org/nuxt-community/auth-module/status.svg?style=flat-square">
</a>
<a href="https://standardjs.com">
    <img alt="" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square">
</a>
<a href="https://circleci.com/gh/nuxt-community/auth-module">
    <img alt="" src="https://img.shields.io/circleci/project/github/nuxt-community/auth-module.svg?style=flat-square">
</a>
<a href="https://codecov.io/gh/nuxt-community/auth-module">
    <img alt="" src="https://img.shields.io/codecov/c/github/nuxt-community/auth-module.svg?style=flat-square">
</a>
<br>
<a href="https://npmjs.com/package/@nuxtjs/auth-next">
    <img alt="" src="https://img.shields.io/npm/v/@nuxtjs/auth-next/latest.svg?style=flat-square">
</a>
<a href="https://npmjs.com/package/@nuxtjs/auth">
    <img alt="" src="https://img.shields.io/npm/dt/@nuxtjs/auth-next.svg?style=flat-square">
</a>
</p>

## Nuxt 3 Support

Nuxt 3 comes with built-in utilities to support session and authentication. We are working on a new official module. 

Meanwhile, we recommend:

- [Nuxt Auth Utils](https://github.com/atinux/nuxt-auth-utils)
- [Sidebase Nuxt Auth](https://github.com/sidebase/nuxt-auth) based on next-auth
- [AuthJs Nuxt](https://github.com/Hebilicious/authjs-nuxt) based on Auth.js
- Implement your own auth using [Lucia](https://lucia-auth.com/guidebook/sign-in-with-username-and-password/nuxt/) or [Nuxt Auth Template](https://github.com/nuxt/examples/tree/main/auth/local)


## Nuxt 2 Installation and Usage

<a href="https://auth.nuxtjs.org">Read Documentation</a>

**🚧 please see [status page](http://auth.nuxtjs.org/status) in documentation.**

## Development

Running demo for development:

```bash
$ yarn install
$ yarn dev
```

Running tests for development:

```bash
$ yarn build
$ yarn nuxt build test/fixture
$ yarn jest
```

## License

[MIT License](./LICENSE) - Copyright (c) Nuxt Community
