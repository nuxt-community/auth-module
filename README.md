# @nuxtjs/auth
[![npm (scoped with tag)](https://img.shields.io/npm/v/@nuxtjs/auth/latest.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![npm](https://img.shields.io/npm/dt/@nuxtjs/auth.svg?style=flat-square)](https://npmjs.com/package/@nuxtjs/auth)
[![CircleCI](https://img.shields.io/circleci/project/github/nuxt-community/auth-module.svg?style=flat-square)](https://circleci.com/gh/nuxt-community/auth-module)
[![Codecov](https://img.shields.io/codecov/c/github/nuxt-community/auth-module.svg?style=flat-square)](https://codecov.io/gh/nuxt-community/auth-module)
[![Dependencies](https://david-dm.org/nuxt-community/auth-module/status.svg?style=flat-square)](https://david-dm.org/nuxt-community/auth-module)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

> Auth Module

[📖 **Release Notes**](./CHANGELOG.md)

## Setup
- Add `@nuxtjs/auth` dependency using yarn or npm to your project
- Add `@nuxtjs/auth` to `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/auth'
 ],
 auth: {
   /* auth options */
 }
}
```

## Options

### default_user
Default fields for `state.auth.user`. (overrides using Object.assign when logged-in).

### token_cookie
Token cookie opts. (see [js-cookie docs](https://github.com/js-cookie/js-cookie) for more info)

## License

[MIT License](./LICENSE)

Copyright (c) Pooya Parsa <pooya@pi0.ir>