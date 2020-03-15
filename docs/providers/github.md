# GitHub

[Source Code](https://github.com/nuxt-community/auth-module/blob/master/lib/providers/github.js)

## Usage

```js
auth: {
  strategies: {
      github: {
        clientId: '...',
        clientSecret: '...'
      },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('github')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

## Obtaining `clientId` and `clientSecret`

This option is **REQUIRED**. To obtain one, create your app in [Create a new Oauth APP](https://github.com/settings/applications/new) and use provided "Client ID" and "Client Secret".

