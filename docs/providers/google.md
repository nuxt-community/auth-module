# Google Provider

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/google.js)

## Usage

```js
auth: {
  strategies: {
      google: {
        client_id: '...'
      },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('google')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

### Obtaining `client_id`

This option is **REQUIRED**. To obtain one, create your app in [Google API Console](https://console.developers.google.com), Create a new project and from Credentials tab, create a new "Oauth Client ID".

