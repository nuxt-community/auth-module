---
title: Auth0
description: Auth0 is a great authentication-as-a-service platform for free!
position: 31
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/auth0/index.ts)

[Auth0](https://auth0.com) is a great authentication-as-a-service platform for free!

A [live demo](https://auth0.nuxtjs.org) is available as well as the [source](https://github.com/nuxt/example-auth0).

## Usage

```js
auth: {
  strategies: {
    auth0: {
      domain: 'domain.auth0.com',
      clientId: '....',
      audience: 'https://my-api-domain.com/'
    }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('auth0')
```

User will be redirected to a page like this:

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/web/hosted-login.png">


💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId`, `domain`, and `audience`

`clientId` and `domain` are **REQUIRED**. Your application needs some details about this client to communicate with Auth0.

`audience` is required _unless_ you've explicitly set a default audience [on your Auth0 tenant](https://manage.auth0.com/#/tenant).

You can get your `clientId` and `domain` the Settings section for your client in the [Auth0 API dashboard](https://manage.auth0.com/#/applications). Your audience is defined on your [client's API](https://manage.auth0.com/#/apis).

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/dashboard/client_settings.png">

## Logout with new Auth0 tenants

On logout, local `auth` is reset and you will be instantly redirected to `Auth0` so your session is destroyed remotely as well. After that, you will be redirected back to your website by `Auth0`.

To make sure you are redirected to the right page, you need to setup two things:
* Go to into the `Tenant Settings` > `Advanced` and enter the allowed URL(s) you can redirect to in `Allowed Logout URLs`, such as `http://localhost:3000`
* Add `logoutRedirectUri` to your config and add the value you just configured:
  
```js
auth: {
  strategies: {
    auth0: {
      logoutRedirectUri: 'http://localhost:3000',
    }
  }
}
```

Now you can logout calling the `logout` function:

```js
await this.$auth.logout()
```

## PKCE Grant flow 

From [Auth0](https://auth0.com/docs/flows/concepts/auth-code-pkce)
> The PKCE-enhanced Authorization Code Flow introduces a secret created by the calling application that can be verified by the authorization server;this secret is called the Code Verifier. Additionally, the calling app creates a transform value of the Code Verifier called the Code Challenge and sends this value over HTTPS to retrieve an Authorization Code. This way, a malicious attacker can only intercept the Authorization Code, and they cannot exchange it for a token without the Code Verifier.

To configure the `PKCE Grant flow` instead of the default `Implicit Grant flow`, additions have to be made to the `Auth0 settings` and to `nuxt.config.js`:
- Applications > "your app" > Settings > Application Type > choose Native
- Applications > "your app" > Settings > Show Advanced Settings > Grant Types > enable Refresh Token (and disable Implicit)
- APIs > "your api" > Allow Offline Access > enable
- `nuxt.config.js`:

```js{}[nuxt.config.js]
auth: {
  strategies: {
    auth0: {
      domain: 'domain.auth0.com',
      clientId: '....',
      audience: 'https://my-api-domain.com/',
      scope: ['openid', 'profile', 'email', 'offline_access'],
      responseType: 'code',
      grantType: 'authorization_code',
      codeChallengeMethod: 'S256',
    }
  }
}


```
