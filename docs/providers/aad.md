---
sidebarDepth: 0
---

# Azure Active Directory

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/aad.js)

## Usage

```js
auth: {
  strategies: {
      aad: {
        client_id: process.env.AAD_CLIENT_ID,
        client_secret: process.env.AAD_CLIENT_SECRET,
        tenant_id: process.env.AAD_TENANT_ID,
        grant_type: 'authorization_code'
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