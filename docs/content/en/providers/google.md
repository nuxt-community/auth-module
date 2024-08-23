---
title: Google
description: This provider is based on oauth2 scheme and supports all scheme options
position: 35
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/google.ts)

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

Additional arguments can be passed through to Google as the `params` key of the second argument:

```js
this.$auth.loginWith('google', { params: { prompt: 'select_account' } })
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId`

This option is **REQUIRED**. To obtain one, create your app in [Google API Console](https://console.developers.google.com), Create a new project and from Credentials tab, create a new "Oauth Client ID".
Go to APIs and services then to Oauth consent screen, after that fill form with your app details.
Sections two - scopes - for most users email and profile will be enough.
Press save and countinue.
Go To Credentials click create credentials -> OAuth client ID and select web app.
You will receive clientID and secret key. copy the clientId to your nuxt config file.
You will need to handel to auth with a server side like Django, Node, Go etc.
after that you config will look like that

```js
google: {
        clientId: '<you client id>',
        codeChallengeMethod: '',
        responseType: 'code',
        endpoints: {
          token: 'http://localhost:8000/user/google/', // your backend url to resolve your auth with google and give you the token back
          userInfo: 'http://localhost:8000/auth/user/' // your endpoint to get the user info after you received the token
        },
      },
```

If you are looking for an example you can look [Nuxt And Django With Google](https://medium.com/swlh/how-to-build-google-social-login-in-django-rest-framework-and-nuxt-auth-and-refresh-its-jwt-token-752601d7a6f3)
