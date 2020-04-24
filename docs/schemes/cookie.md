# Cookie

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/cookie.ts)

`cookie` is an extended version of [local scheme](./local.md), which instead of using a token, depends on cookie set by auth provider.

## Options

**NOTE:** All [local scheme](./local.md) options are also supported.

```js
auth: {
  strategies: {
    cookie: {
      cookie: {
        // (optional) If set we check this cookie exsistence for loggedIn check
        name: 'XSRF-TOKEN',
      }
    },
    endpoints: {
      // (optional) If set, we send a get request to this endpoint before login
      xsrf: {
        url: ''
      }
    }
  }
}
```

