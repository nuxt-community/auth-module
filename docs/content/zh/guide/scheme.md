---
title: 方案与策略
description: 方案是定义身份验证的逻辑。策略是Scheme的一个配置实例。在项目中可以有多种方案和策略
position: 4
category: Guide
---

方案定义身份验证逻辑。策略是方案的已配置实例。您的项目中可以有多个方案和策略。

`auth.strategies` 选项是一个对象。键是策略名称，值是配置。

```js{}[nuxt.config.js]
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

默认情况下，**实例名称与方案名称相同**. 如果您希望通过提供自己的方案或拥有同一方案的多个实例来获得更大的灵活性，则可以使用以下属性 `scheme'

```js{}[nuxt.config.js]
auth: {
  strategies: {
    local1: { scheme: 'local', /* ... */ },
    local2: { scheme: 'local', /* ... */ },
    custom: { scheme: '~/schemes/customStrategy', /* ... */ },
  }
}
```

## 创建自己的策略

<alert type="warning">由于 v5 仍在开发中，因此此功能可能会有重大改变</alert>

有时，包含的方案不符合您的要求。创建您自己的方案将提供您所需的灵活性。您可以从头开始创建新方案或扩展现有方案。

> **注意** 在将来的版本中将添加可用方案方法的列表。

首先，在中创建自己的方案文件 `~/schemes` 中（如果您愿意，可以使用不同的路径。)

> 在这个例子中，我们将进行扩展 `local` 方案和覆盖 `fetchUser` 方法。我们将在设置用户对象之前转换它。

```js{}[~/schemes/customScheme.js]
import { LocalScheme } from '~auth/runtime'

export default class CustomScheme extends LocalScheme {
  //覆盖' local '方案的' fetchUser '方法
  async fetchUser (endpoint) {
    // Token is required but not available
    if (!this.check().valid) {
      return
    }

    // 禁止用户端点
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // 尝试获取用户，然后设置
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      const user = getProp(response.data, this.options.user.property)

      // 转换用户对象
      const customUser = {
        ...user,
        fullName: user.firstName + ' ' + user.lastName,
        roles: ['user']
      }

      // 设置自定义用户
      // ' customUser '对象可以通过' this.$auth.user '访问
      // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
      this.$auth.setUser(customUser)

      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })
  }
}
```

然后在身份验证配置中设置新方案。

```js{}[nuxt.config.js]
auth: {
  strategies: {
    customStrategy: {
      scheme: '~/schemes/customScheme',
      /* ... */
    }
  }
}
```

就是这样！现在，您可以使用新策略登录。

```js
this.$auth.loginWith('customStrategy', {
  /* ... */
})
```

<alert type="success">如果您认为您的自定义方案可能对其他人有帮助，请考虑使用您的配置创建 GitHub 问题或拉取请求。</alert>
