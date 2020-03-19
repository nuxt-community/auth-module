# Laravel Passport

[Source Code](https://github.com/nuxt-community/auth-module/blob/master/lib/providers/laravel.passport.js)

## Usage

```js
auth: {
  strategies: {
      'laravel.passport': {
        url: '...',
        clientId: '...',
        clientSecret: '...'
      },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('laravel.passport')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

### Obtaining `url`, `clientId` and `clientSecret`

These options are **REQUIRED**. The `url` is the location of your Laravel application. To obtain the `client_id` and `client_secret`, create a new client app in  your [Laravel app](https://laravel.com/docs/6.0/passport#managing-clients).

