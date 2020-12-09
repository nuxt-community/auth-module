---
title: Google
description: This provider is based on oauth2 scheme and supports all scheme options
position: 35
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/google/index.ts)

## Usage

```js
auth: {
  strategies: {
    google: {
      clientId: '...'
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('google')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId`

This option is **REQUIRED**. To obtain one, create your app in [Google API Console](https://console.developers.google.com), Create a new project and from Credentials tab, create a new "Oauth Client ID".

