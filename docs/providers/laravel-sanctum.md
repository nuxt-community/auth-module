# Laravel Sanctum

[Source Code](https://github.com/nuxt-community/auth-module/blob/master/lib/providers/laravel.sanctum.js)

Laravel Sanctum provides a featherweight authentication system for SPAs (single page applications), mobile applications, and simple, token based APIs. Sanctum allows each user of your application to generate multiple API tokens for their account. These tokens may be granted abilities / scopes which specify which actions the tokens are allowed to perform. ([Read More](https://laravel.com/docs/7.x/sanctum))

## Usage

```js
auth: {
  strategies: {
      'laravelSanctum': {
        url: '<laravel url>'
      },
  }
}
```

**NOTE:** It is highly recommanded to use proxy to avoid CORS and same-site policy issues:

```js
{
  axios: {
    proxy: true
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

💁 This provider is based on [cookie scheme](../schemes/cookie.md) and supports all scheme options.

