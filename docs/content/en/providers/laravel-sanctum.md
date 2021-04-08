---
title: Laravel Sanctum
description: This provider is for the Laravel Sanctum
position: 38
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/laravel/sanctum.ts)

Laravel Sanctum provides a featherweight authentication system for SPAs (single page applications), mobile applications, and simple, token based APIs. Sanctum allows each user of your application to generate multiple API tokens for their account. These tokens may be granted abilities / scopes which specify which actions the tokens are allowed to perform. ([Read More](https://laravel.com/docs/8.x/sanctum))

## Usage

```js
auth: {
  strategies: {
    'laravelSanctum': {
      provider: 'laravel/sanctum',
      url: '<laravel url>'
    },
  }
}
```

**NOTE:** It is highly recommended to use proxy to avoid CORS and same-site policy issues:

```js
{
  axios: {
    proxy: true,
    credentials: true
  },
  proxy: {
    '/laravel': {
      target: 'https://laravel-auth.nuxtjs.app',
      pathRewrite: { '^/laravel': '/' }
    }
  },
  auth: {
    strategies: {
      'laravelSanctum': {
        provider: 'laravel/sanctum',
        url: '<laravel url>'
      }
    }
  }
}
```

To login user:

```js
this.$auth.loginWith('laravelSanctum', {
  data: {
    email: '',
    password: ''
  }
})
```

💁 This provider is based on [cookie scheme](../schemes/cookie) and supports all scheme options.

