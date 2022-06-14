---
title: Cookie
description: '你可以在全局或每条路由上启用' auth '中间件。'
position: 21
category: 方案
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/cookie.ts)

`cookie` 是 [本地方案](../local) 的扩展版本, 它依赖于身份验证提供程序设置的 Cookie，而不是使用 token。

## 选项

**注意:** [本地方案](./local) 还支持所有选项

```js
auth: {
  strategies: {
    cookie: {
      cookie: {
      //(可选)如果设置为loggedIn，我们检查cookie是否存在
        name: 'XSRF-TOKEN',
      },
      endpoints: {
      //(可选)如果设置了，我们在登录之前向这个端点发送一个get请求
        csrf: {
          url: ''
        }
      }
    },
  }
}
```
