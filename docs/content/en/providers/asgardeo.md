---
title: Asgardeo
description: Asgardeo is an identity-as-a-service platform by WSO2 built on OpenID Connect.
position: 32
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/asgardeo.ts)

[Asgardeo](https://wso2.com/asgardeo/) is an identity-as-a-service (IDaaS) platform by WSO2 with first-class OpenID Connect support.

## Usage

```js
auth: {
  strategies: {
    asgardeo: {
      clientId: '<CLIENT_ID>',
      issuer: 'https://api.asgardeo.io/t/<TENANT>',
      scope: ['openid', 'profile', 'email']
    }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('asgardeo')
```

💁 This provider is based on the [openIDConnect scheme](../schemes/openIDConnect) and supports all of its options.

## Obtaining `clientId` and `issuer`

`clientId` and `issuer` are **REQUIRED**.

- `clientId` — register a **Single-Page Application** in the [Asgardeo Console](https://console.asgardeo.io) and copy its client ID. Public clients use the Authorization Code flow with PKCE, so no client secret is stored in the bundle.
- `issuer` — your Asgardeo organization URL, `https://api.asgardeo.io/t/<TENANT>`, where `<TENANT>` is your organization name. The provider uses this value to resolve the Asgardeo OpenID Connect discovery endpoint automatically.

The provider derives the OpenID Connect discovery document from the issuer:

```
<issuer>/oauth2/token/.well-known/openid-configuration
```

All endpoints (authorization, token, userInfo, logout) are then resolved automatically from that document, so you normally do not set them by hand.

## Redirect URLs

In the Asgardeo Console, add your callback route to the application's **Authorized redirect URLs** (defaults to `/login`, e.g. `http://localhost:3000/login`). To be redirected back after logout, also add your logout target and set `logoutRedirectUri`:

```js
auth: {
  strategies: {
    asgardeo: {
      clientId: '<CLIENT_ID>',
      issuer: 'https://api.asgardeo.io/t/<TENANT>',
      logoutRedirectUri: 'http://localhost:3000'
    }
  }
}
```

Then log out with:

```js
await this.$auth.logout()
```
