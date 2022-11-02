---
title: OpenIDConnect
description: OpenID Connect 1.0是在OAuth 2.0协议之上的一个简单的身份层。它使客户端能够根据授权服务器执行的身份验证来验证最终用户的身份，并以一种可互操作的rest式方式获得关于最终用户的基本概要信息。
position: 23
category: 方案
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/schemes/openIDConnect.ts)

由于OpenID Connect是OAuth 2.0协议之上的一层，因此该方案扩展了OAuth 2.0方案。

请参阅 [OAuth2 方案](./oauth2) 了解更多信息。

## Usage

```js
this.$auth.loginWith('openIDConnect')
```

可以使用第二个参数的 `params` 键将其他参数传递给 OpenID Connect 提供程序：

```js
this.$auth.loginWith('openIDConnect', { params: { another_post_key: 'value' } })
```

## 选项

最小配置：

```js
auth: {
  strategies: {
    oidc: {
      scheme: 'openIDConnect',
      clientId: 'CLIENT_ID',
      endpoints: {
        configuration: 'https://accounts.google.com/.well-known/openid-configuration',
      },
    }
  }
}
```

默认配置：

```js
auth: {
  strategies: {
    oidc: {
      scheme: 'openIDConnect',
      endpoints: {
        configuration: 'https://accounts.google.com/.well-known/openid-configuration',
      },
      idToken: {
        property: 'id_token',
        maxAge: 60 * 60 * 24 * 30,
        prefix: '_id_token.',
        expirationPrefix: '_id_token_expiration.'
      },
      responseType: 'code',
      grantType: 'authorization_code',
      scope: ['openid', 'profile', 'offline_access'],
      codeChallengeMethod: 'S256',
    }
  }
}
```

### `endpoints`

每个端点都用于使用 axios 发出请求。他们基本上是在扩展Axios [Request Config](https://github.com/axios/axios#request-config).

#### `configuration`

**必要的** -用于请求提供程序的元数据文档以自动设置终结点的终结点。包含 OpenID 提供程序的大部分信息（如要使用的 URL 和服务的公共签名密钥的位置）的元数据文档。您可以通过将发现文档路径（/.well-known/openid-configuration）附加到颁发机构 URL (https://example.com).来查找此文档。

例如. `https://example.com/.well-known/openid-configuration`

更多信息: https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig

OAuth2 方案中定义的每个终结点也可以在 OpenID Connect 方案配置中使用。这将覆盖配置文档提供的信息。

### `clientId`

**必要的** - OpenID 连接客户端 ID。

### `scope`

- 默认: `['openid', 'profile', 'offline_access']`

OpenID Connect 访问范围。

### `token`

访问令牌

#### `property`

- 默认: `access_token`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应可以是 `false`，也可以是更复杂的，比如 `auth.access_token`。

#### `type`

- 默认: `Bearer`

它将用于 axios 请求的 `Authorization` 标头。

#### `maxAge`

- 默认: `1800`

在这里设置令牌的过期时间，单位为**秒**。
如果由于某种原因我们无法解码令牌以获取到期日期，则将使用此时间。

应与登录页面相同或欢迎屏幕的相对路径。 ([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

默认情况下设置为 30 分钟。

### `idToken`

OpenIDConnect 方案将保存访问和 ID 令牌。 这是因为要在授权服务器上结束用户会话，ID 令牌需要通过必要的参数“id_token_hint”作为注销请求的一部分。

#### `property`

- 默认: `id_token`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应可以是 `false`，也可以是更复杂的，比如 `auth.id_token`。

#### `maxAge`

- 默认: `1800`

此处设置 ID 令牌的过期时间，单位为**秒**。
如果由于某种原因我们无法解码 ID 令牌以获取到期日期，则将使用此时间。

默认设置为 30 分钟。

### `refreshToken`

#### `property`

- 默认: `refresh_token`

`property` 可用于指定响应 JSON 的哪个字段用于值。 直接使用 API 响应或者更复杂的比如 auth.refresh_token 可以是 `false`。

#### `maxAge`

- 默认: `60 * 60 * 24 * 30`

此处设置刷新令牌的过期时间，单位为**秒**。
如果由于某种原因我们无法解码令牌以获取到期日期，则将使用此时间。

默认设置为 30 天。

### `responseType`

- 默认: `code`

设置为 `code` 以获取授权代码流。

### `grantType`

- 默认: `authorization_code`

设置为 `authorization_code` 以获取授权代码流。

### `redirectUri`

应与登录页面或欢迎页面的相对路径相同。([example](https://github.com/nuxt-community/auth-module/blob/dev/examples/demo/pages/callback.vue))

默认情况下，它将从 `redirect.callback` 选项推断。 （默认为`/login`）

### `logoutRedirectUri`

应该是欢迎页面的绝对路径

### `codeChallengeMethod`

默认情况下是 `implicit`，这是当前的工作流实现。 为了支持 PKCE ('pixy') 协议，有效选项包括 'S256' 和 'plain'。 ([阅读更多](https://tools.ietf.org/html/rfc7636))

默认: `S256`

### `acrValues`

提供元数据以向授权服务器提供附加信息。 ([阅读更多](https://ldapwiki.com/wiki/Acr_values))

### `autoLogout`

- 默认: `false`

如果令牌已过期，它将阻止令牌在加载页面时刷新并强制注销使用r.
