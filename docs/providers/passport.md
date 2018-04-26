# Github

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/passport.js)

## Usage

```js
auth: {
  strategies: {
      passport: {
        url: '...',
        client_id: '...',
        client_secret: '...'
      },
  }
}
```

## Usage

Anywhere in your application logic:

```js
this.$auth.loginWith('passport')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

### Obtaining `url`, `client_id` and `client_secret`

These options are **REQUIRED**. The `url` is the location of your Laravel application. To obtain the `client_id` and `client_secret`, create a new client app in  your [Laravel app](https://laravel.com/docs/5.6/passport#managing-clients).

