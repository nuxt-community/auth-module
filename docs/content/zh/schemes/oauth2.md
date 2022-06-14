---
title: OAuth2
description: Oauth2支持多种Oauth2登录流程。您可以使用许多预先配置的提供程序(如auth0)，而不是直接使用此模式。
position: 23
category: 方案
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/oauth2.ts)

`oauth2` 支持各种 oauth2 登录流。您可以使用许多预配置的提供程序如 [auth0](../../providers/auth0) 而不是直接使用此方案。

## 使用

```js
this.$auth.loginWith('social')
```

可以使用第二个参数的 `params` 键将其他参数传递给 OAuth 提供程序：

```js
this.$auth.loginWith('social', { params: { another_post_key: 'value' } })
```

## Token 刷新

如果提供程序颁发刷新 token ，这些 token 将用于在每次 axios 请求之前刷新 token 。注意：此功能仅支持 jwt  token 。

### 刷新 token 过期时的行为

如果刷新 token 已过期，则无法刷新 token 。您可以在下面找到服务器端和客户端的不同行为。

#### 服务器端（在页面重新加载或初始导航期间）

用户已注销并导航到 **home** 页面.

#### 客户端（客户端启动的 axios 请求）

用户已注销并导航到**注销**页面，以明确解释发生的情况。

## 选项

```js
auth: {
  strategies: {
    social: {
      scheme: 'oauth2',
      endpoints: {
        authorization: 'https://accounts.google.com/o/oauth2/auth',
        token: undefined,
        userInfo: 'https://www.googleapis.com/oauth2/v3/userinfo',
        logout: 'https://example.com/logout'
      },
      token: {
        property: 'access_token',
        type: 'Bearer',
        maxAge: 1800
      },
      refreshToken: {
        property: 'refresh_token',
        maxAge: 60 * 60 * 24 * 30
      },
      responseType: 'token',
      grantType: 'authorization_code',
      accessType: undefined,
      redirectUri: undefined,
      logoutRedirectUri: undefined,
      clientId: 'SET_ME',
      scope: ['openid', 'profile', 'email'],
      state: 'UNIQUE_AND_NON_GUESSABLE',
      codeChallengeMethod: '',
      responseMode: '',
      acrValues: '',
      // autoLogout: false
    }
  }
}
```

### `endpoints`

每个端点都用于使用 axios 发出请求。他们基本上是在扩展Axios [Request Config](https://github.com/axios/axios#request-config).

#### `authorization`

**必须** - 用于启动登录流的终结点。取决于 oauth 服务。

#### `userInfo`

虽然不是 oauth2 规范的一部分，但几乎所有 oauth2 提供程序都公开此终结点以获取用户配置文件。

#### `token`

如果使用 Google 代码授权流程 (`responseType: 'code'`) 为接受 POST 请求的服务提供 URI，该请求带有包含 `code` 属性的 JSON 有效负载，并返回 token  [由提供者交换](https://developers .google.com/identity/protocols/OpenIDConnect#exchangecode) 用于“代码”。 参见[源代码](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/oauth2.ts)

如果设置了 `false` 值，我们只会登录而不获取用户配置文件。

#### `logout`

从 Oauth2 提供者的系统中注销用户的端点。 确保用户退出当前授权会话。

### token

#### `property`

- 默认值: `access_token`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应可以是 `false`，也可以是更复杂的，比如 `auth.access_token`。

::: 提示
如果您需要使用 IdToken 而不是 AccessToken，请将此选项设置为 `id_token`。
:::

#### `type`

- 默认值: `Bearer`

它将用于 axios 请求的 `Authorization` 标头。

#### `maxAge`

- 默认值: `1800`

在这里设置 token 的过期时间，单位为**秒**。
如果由于某种原因我们无法解码 token 以获取到期日期，则将使用此时间。

应与登录页面或欢迎屏幕的相对路径相同。 （[示例]（https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue））

默认情况下设置为 30 天。

### `refreshToken`

#### `property`

- 默认值: `refresh_token`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应或者更复杂的比如 auth.refresh_token 可以是 `false`。

#### `maxAge`

- 默认值: `60 * 60 * 24 * 30`

在这里，您可以设置 token 的过期时间以**秒为单位**.
如果由于某种原因我们无法解码 token 以获取到期日期，则将使用此时间。

默认情况下设置为 30 天。

### `responseType`

- 默认值: `token`

如果您使用 `code` ，您可能必须实现服务器端逻辑来签署响应代码。

### `grantType`

设置为 `authorization_code` 以获取授权代码流。

### `accessType`

如果使用 Google 代码授权流程 (`responseType: 'code'`) 设置为 `offline` 以确保在初始登录请求中返回刷新 token 。 （请参阅 [Google 文档](https://developers.google.com/identity/protocols/OpenIDConnect#refresh-tokens)）

### `redirectUri`

应与登录页面或欢迎屏幕的相对路径相同。 （[示例]（https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue））

默认情况下，它将从 `redirect.callback` 选项推断。 （默认为`/login`）

### `logoutRedirectUri`

应该是欢迎页面的绝对路径

### `clientId`

**必须** - oauth2 客户端 ID

### `scope`

**必须** - Oauth2 访问作用域。

### `state`

使用 state 参数的主要原因是缓解 CSRF 攻击 ([read more](https://auth0.com/docs/protocols/oauth2/oauth-state))

默认情况下设置为随机生成的字符串。

### `codeChallengeMethod`

默认为'implicit'，即当前工作流实现。为了支持PKCE ('pixy')协议，有效的选项包括'S256'和'plain'。((了解更多)(https://tools.ietf.org/html/rfc7636))

### `acrValues`

提供元数据以向授权服务器提供其他信息。([read more](https://ldapwiki.com/wiki/Acr_values))

### `autoLogout`

- 默认值: `false`

如果 token 已过期，它将阻止在重新加载页面时刷新 token ，并将强制用户注销。
