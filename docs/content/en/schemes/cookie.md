---
title: Cookie
description: 'You can enable `auth` middleware either globally or per route.'
position: 21
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/cookie.ts)

`cookie` is an extended version of [local scheme](./local), which instead of using a token, depends on cookie set by auth provider.

## Options

**NOTE:** All [local scheme](./local) options are also supported.

```js
auth: {
  strategies: {
    cookie: {
      cookie: {
        // (optional) If set we check this cookie exsistence for loggedIn check
        name: 'XSRF-TOKEN',
      },
      endpoints: {
        // (optional) If set, we send a get request to this endpoint before login
        csrf: {
          url: ''
        }
      }
    },
  }
}
```

