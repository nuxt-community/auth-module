---
title: Kakao
description: This provider is based on oauth2 scheme and supports all scheme options
position: 39
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/kakao.ts)


## Usage

```js
auth: {
  strategies: {
    kakao: {
      clientId: '...',
      redirectUri: '...'
    }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('kakao')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId` and `redirectUri`

This option is **REQUIRED**. 
To obtain one, create your app in [Create new Application](https://developers.kakao.com/console/app) 
and use provided "Javascript Key" on "clientId".
Next, you have to register "redirectUri" in Kakao Login > Redirect URI because @nuxt/auth-module use REST API.


