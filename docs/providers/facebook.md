# Facebook

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/facebook.js)

## Usage

```js
auth: {
  strategies: {
    facebook: {
      endpoints: {
        userInfo: 'https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email,birthday'
      },
      clientId: '...',
      scope: ['public_profile', 'email', 'user_birthday']
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('facebook')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

## Obtaining `clientId`

This option is **REQUIRED**. To obtain one, create your app in [Facebook Developers](https://developers.facebook.com) and add "Facebook Login" product. Then set valid callback URLs. Client ID is same as your "App ID".

