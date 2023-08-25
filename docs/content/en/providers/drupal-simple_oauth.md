---
title: Drupal Simple OAuth
description: This provider is based on oauth2 scheme and supports all scheme options
position: 33
category: Providers
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/drupal-simple_oauth.ts)


## Usage

```js
auth: {
  strategies: {
    'drupal/simple_oauth': {
      clientId: '...',
      clientSecret: '...',
      url: '<drupal url>'
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('drupal/simple_oauth')
```

💁 This provider is based on [oauth2 scheme](../schemes/oauth2) and supports all scheme options.

## Obtaining `clientId` and `clientSecret`

This option is **REQUIRED**. To obtain one, create a Client Application by going to: `<drupal url>/admin/config/services/consumer/add`.

See the [Drupal Simple OAuth module](https://www.drupal.org/project/simple_oauth) documentation for more details.
