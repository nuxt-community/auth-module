---
title: Laravel Passport
description: This provider is for the Laravel Passport
position: 37
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/laravel/passport.ts)

## Usage

```js
auth: {
  strategies: {
    'laravelPassport': {
      provider: 'laravel/passport',
      endpoints: {
        userInfo: '...'
      },
      url: '...',
      clientId: '...',
      clientSecret: '...'
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('laravelPassport')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

### Obtaining `url`, `clientId` and `clientSecret`

These options are **REQUIRED**. The `url` is the location of your Laravel application. To obtain the `client_id` and `client_secret`, create a new client app in your [Laravel app](https://laravel.com/docs/passport#managing-clients).

### User endpoint
`userInfo` endpoint is used to make requests using axios to fetch user data.

### Token Lifetimes
By default, Passport issues long-lived access tokens that expire after one year. If you change their lifetime, don't forget to update [token max age](../schemes/oauth2#token-2) and [refresh token max age](../schemes/oauth2#refreshtoken).
