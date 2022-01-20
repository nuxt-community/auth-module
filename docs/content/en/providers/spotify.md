---
title: Spotify
description: This provider is based on oauth2 scheme and supports all scheme options
position: 36
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/spotify.ts)

⚠️ The Spotify provider is **still under development**, you can always use it in your local development.

## Usage

```js
auth: {
  strategies: {
    spotify: {
      clientId: '...',
      clientSecret: '...'
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('spotify')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId` and `clientSecret`

This option is **REQUIRED**. To obtain one, create your app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and use provided "Client ID" and "Client Secret".
