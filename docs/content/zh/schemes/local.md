---
title: Local
description: 对于像JWT这样的流，local是默认的基于 credentials/token 的方案。
position: 22
category: Schemes
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/local.ts)

对于像`JWT`这样的流，`local` 是默认的基于 credentials/token 的方案。

**注意:** 您可以使用基于本地的 [cookie 方案](./cookie) 但针对基于 Cookie 的 API 进行了修改。

默认情况下 `local` 已启用并预配置方案， 你可以设置 `strategies.local` 为 `false` 禁用它。

## 用法

通过在请求正文中将凭据作为 JSON 对象发送来执行基于密码的登录：

```vue
<template>
  <div>
    <form @submit.prevent="userLogin">
      <div>
        <label>Username</label>
        <input type="text" v-model="login.username" />
      </div>
      <div>
        <label>Password</label>
        <input type="password" v-model="login.password" />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script>
export 默认 {
  data() {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async userLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: this.login
        })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
```

## 后端

您将需要一个实现身份验证基础知识的后端服务器。由于这是非常敏感的代码，因此我们强烈建议您也为后端使用已建立的身份验证库。

后端至少需要处理登录和注销。默认情况下，它还需要包含一个端点来获取用户信息（ID，电子邮件等）。如果您的前端不需要了解有关您的用户的任何事情，则可以使用 [`endpoints.user = false`](/schemes/local#user) 禁用此功能。在本例中，`this.$auth.user` 将为 `{}`.

### 登录

后端应验证登录凭据，然后返回一个 JSON 正文，其中包含前端可用于充当此用户的token。JSON 正文格式在 [本地方案配置的 token 部分中配置。](#token).

> 提示: 如果要使用 Cookie 而不是基于 token 的身份验证，请使用
> [cookie](./cookie) 方案.

将整个后端响应传递给 `loginWith` 响应中,因此您可以传递有关用户的其他信息，例如用于授权（这超出了@nuxtjs/身份验证的范围）

### 获取用户

身份验证模块不保存有关用户的信息，因此需要有一种方法来获取用户的信息，例如页面重新加载。这就是用户终结点的用途。默认情况下，在成功登录后也会调用 this。

如果 [`user.autoFetch` 为 true (默认值)](#user), 然后在成功登录后立即发送对 'endpoints.user' 的请求. 该端点应响应特定用户的 JSON 信息，该信息直接分配给 [用户属性](../api/auth#user).

如果您希望直接从登录会话返回用户信息, 配置 `user.autoFetch` 为 false, 从 `loginWith` 响应中获取用户信息，并将其传递给 [`setUser`](../api/auth#setuseruser).

如果要完全禁用获取用户信息，请设置 `endpoints.user: false`。
这意味着永远不会调用用户信息端点，但也表示前端对用户一无所知； `this.$auth.user` 将是 `{}`。

## 参数

基于 token 的流程示例

```js
auth: {
  strategies: {
    local: {
      token: {
        property: 'token',
        global: true,
        // required: true,
        // type: 'Bearer'
      },
      user: {
        property: 'user',
        // autoFetch: true
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
        logout: { url: '/api/auth/logout', method: 'post' },
        user: { url: '/api/auth/user', method: 'get' }
      }
    }
  }
}
```

基于 Cookie 的流程示例：

```js
auth: {
  strategies: {
    local: {
      token: {
        required: false,
        type: false
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
      }
    }
  }
}
```

### `endpoints`

每个端点都用于使用 axios 发出请求。他们基本上是在扩展 Axios [Request Config](https://github.com/axios/axios#request-config).

::: 提示
要禁用每个端点，只需将其值设置为 `false`.
:::

### `token`

在这里，您将配置 token 选项。

#### `property`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应或者更复杂的比如 `auth.token` 可以是 `false`。

#### `prefix`

- 默认: `_token.`

`prefix` 在状态中设置 token 前缀。

**Note: 如果您使用的是 vuex，则 token 只会出现在 `auth` 状态，前提是前缀_not_ 以下划线开头 (`_`).**

#### `required`

- 默认: `true`

此选项可用于禁用所有 token 处理。

::: 提示
仅用于 Cookie 流
:::

#### `global`

- 默认: `true`

这将确定身份验证 token 是否自动包含在所有自定义 axios 请求中。

#### `name`

- 默认: `Authorization`

在 axios 请求中使用 Authorization header 名称

#### `type`

- 默认: `Bearer`

在 axios 请求中使用 Authorization header 类型

#### `maxAge`

- 默认: `1800`

在这里，您可以设置 token 的过期时间, 以 **秒为单位**.
如果由于某种原因我们无法解码 token 以获取到期日期，则将使用此时间（默认情况下设置为 30 分钟）

### `user`

在这里，您可以配置用户选项。请注意，这些选项应在 local.user 中设置，而不是在用户终结点选项 （local.endpoints.user） 中设置。有关进一步说明，请参阅上面的示例。

#### `property`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应可以是 `false`，也可以是更复杂的，比如 `auth.user`。

#### `autoFetch`

- 默认: `true`

默认, auth 将在成功登录后使用第二个 HTTP 请求加载用户信息。此选项禁用该请求，但不会禁用从用户端点获取用户信息； 为此设置 `endpoints.user: false`。

> 提示: 当您想要从登录请求中返回用户信息以保存额外的 HTTP 往返时，请将此值设置为 false。为此，请从中获取响应并将数据传递给 [setUser](../api/auth#setuser-user). 请注意，除非您使用 `endpoints.user: false` 禁用用户端点，否则您仍然需要实现用户端点，以便 auth 可以获取用户信息，例如 页面刷新。

### `clientId`

- 默认: `false`

如果您的后端需要客户端 ID，可以在此处进行设置。

### `grantType`

- 默认: `false`

如果您的后端需要授权类型，可以在此处进行设置。

### `scope`

- 默认: `false`

如果您的后端需要作用域，可以在此处进行设置。
