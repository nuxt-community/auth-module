---
title: 刷新
description: 刷新是本地模式的扩展版本，适用于使用令牌刷新的系统。
position: 24
category: 方案
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/refresh.ts)

`refresh` 是 `local` 方案的扩展版本，适用于使用令牌刷新的系统。

您可以将 `scheme` 设置为 `refresh` 以启用它。

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
        <input type="text" v-model="login.password" />
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
        let response = await this.$auth.loginWith('local', { data: this.login })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
```

手动刷新令牌：

```js
this.$auth.refreshTokens()
```

## 选项

```js
auth: {
  strategies: {
    local: {
      scheme: 'refresh',
      token: {
        property: 'access_token',
        maxAge: 1800,
        global: true,
        // type: 'Bearer'
      },
      refreshToken: {
        property: 'refresh_token',
        data: 'refresh_token',
        maxAge: 60 * 60 * 24 * 30
      },
      user: {
        property: 'user',
       // autoFetch: true
      },
      endpoints: {
        login: { url: '/api/auth/login', method: 'post' },
        refresh: { url: '/api/auth/refresh', method: 'post' },
        user: { url: '/api/auth/user', method: 'get' },
        logout: { url: '/api/auth/logout', method: 'post' }
      },
      // autoLogout: false
    }
  }
}
```

### `endpoints`

每个端点都用于使用 axios 发出请求。他们基本上是在扩展Axios [Request Config](https://github.com/axios/axios#request-config).

::: 提示
要禁用每个端点，只需将其值设置为 `false`。
:::

### `token`

在这里，您将配置令牌选项。

#### `property`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应或者更复杂的比如 auth.token 可以是 `false`。

#### `global`

- 默认: `true`

这确定身份验证令牌是否自动包含在所有自定义 axios 请求中。

#### `name`

- 默认: `Authorization`

在 axios 请求中使用的 `Authorization header` 名称。

#### `type`

- 默认: `Bearer`

在 axios 请求中使用的 `Authorization header` 类型。

#### `maxAge`

- 默认: `1800`

在这里设置令牌的过期时间，单位为**秒**。
如果由于某种原因我们无法解码令牌以获取到期日期，则将使用此时间。

默认设置为 30 分钟。

### `refreshToken`

您可以在此处配置刷新令牌选项。

#### `property`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应或者更复杂的比如 `auth.refresh_token` 可以是 `false`。

#### `data`

- 默认: `refresh_token`

`data` 可用于设置您要在请求中发送的属性的名称。

#### `maxAge`

- 默认: `60 * 60 * 24 * 30`

在这里设置令牌的过期时间，单位为**秒**。
如果由于某种原因我们无法解码令牌以获取到期日期，则将使用此时间。如果您的刷新令牌未过期，您可以将其设置为 `false`。

默认设置为 30 天。

#### `required`

- 默认: `true`

在不需要刷新令牌来执行刷新的情况下，可以将此选项分配给 `false`。 这会禁用 `refreshToken`。

#### `tokenRequired`

- 默认: `false`

如果启用，授权标头在刷新前不会被清除。

### `user`

您可以在此处配置用户选项。 请注意，这些选项应在 local.user 中设置，而 _not_ 在用户端点选项 (local.endpoints.user) 中设置。 请参阅上面的示例以获得进一步说明。

#### `property`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应可以是 `false`，也可以是更复杂的，比如 `auth.user`。

#### `autoFetch`

- 默认: `true`

此选项可用于在登录后禁用用户获取。 当您的登录响应已经有用户时，它很有用。

### `clientId`

- 默认: `false`

如果您的后端需要客户端 ID，可以在此处设置。

### `grantType`

- 默认: `false`

如果你的后端需要授权类型，可以在这里设置。

### `scope`

- 默认: `false`

如果您的后端需要范围，可以在此处设置。

### `autoLogout`

- 默认: `false`

如果令牌已过期，它将阻止在加载页面时刷新令牌并强制注销用户。