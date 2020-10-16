---
title: Azure AD
description: This provider is based on oauth2 scheme and supports all scheme options
position: 38
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/aad/index.ts)

## Usage

```js
auth: {
  strategies: {
      aad: {
        clientId: process.env.AAD_CLIENT_ID,
        clientSecret: process.env.AAD_CLIENT_SECRET,
        tenantId: process.env.AAD_TENANT_ID,
        grantType: 'authorization_code'
      },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('aad')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

## Obtaining configs

You need to create an app registration from Azure Portal and make sure to set up everything for an OAuth app in the usual way. e.g. whitelist urls.
