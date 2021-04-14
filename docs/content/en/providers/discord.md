---
title: Discord
description: This provider is based on oauth2 scheme and supports all scheme options
position: 32
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/discord/index.ts)

## Usage

```js
auth: {
  strategies: {
    discord: {
      clientId: '...',
      clientSecret: '...'
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('discord')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId` and `clientSecret`

This option is **REQUIRED**. To obtain one, create your app in [Create a new Oauth APP](https://discord.com/developers/applications) and use provided "Client ID" and "Client Secret".

