---
title: 安装
description: 'Nuxt.js 身份验证模块对零模板的支持'
position: 2
category: 指南
---

- [安装](#installation)
- [使用 TypeScript](#using-with-typescript)

## Installation

<alert type="info">

有关在 Nuxt-auth 安装过程和使用模块更多的信息，请查阅 [Nuxt.js 文档](https://nuxtjs.org/guides/configuration-glossary/configuration-modules)

</alert>

向项目添加依赖项：`@nuxtjs/auth-next @nuxtjs/axios`

<code-group>
  <code-block label="yarn" active>

```bash
yarn add --exact @nuxtjs/auth-next
yarn add @nuxtjs/axios
```

  </code-block>
  <code-block label="npm">

```bash
npm install --save-exact @nuxtjs/auth-next
npm install @nuxtjs/axios
```

  </code-block>
</code-group>

然后, 添加到以下部分 `@nuxtjs/auth-next` `modules` `nuxt.config.js`

```js{}[nuxt.config.js]
{
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],
  auth: {
    // Options
  }
}
```

<alert type="warning">

添加新的项目时，请确保已激活 [Vuex store](https://nuxtjs.org/docs/directory-structure/store#activate-the-store)。有关如何执行此操作的更多信息，请参阅 [Nuxt 入门指南e](https://nuxtjs.org/docs/directory-structure/store). `auth-module`

</alert>

## 与 TypeScript 一起使用
<alert type="info">

有关在 Nuxt.js 项目中使用 TypeScript 的更多信息，请访问 [Nuxt Typescript 文档](https://typescript.nuxtjs.org/).

</alert>

添加到项目文件的某个部分: `@nuxtjs/auth-next` `compilerOptions.types` `tsconfig.json`

```json{}[tsconfig.json]
{
  compilerOptions: {
    "types": [
      "@nuxtjs/auth-next",
    ]
  },
}
```

<alert type="warning">

如果在安装类型包后仍然收到错误，则可能需要重新启动项目才能识别新类型。

</alert>
