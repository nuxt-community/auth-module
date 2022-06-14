---
title: 介绍
description: 'Nuxt.js 身份验证模块对零模板的支持'
position: 1
category: ''
---

<img src="/preview.png" class="light-img" />
<img src="/preview-dark.png" class="dark-img" />

身份验证模块 [NuxtJS](https://nuxtjs.org).

Nuxt.js 身份验证模块引入了一个新的概念，即对零模板(Zero-boilerplate)的支持！`Zero-boilerplate` 是一个新的组件库概念，用于提供方法而不提供其主要的样式，更加的符合开发者自定义的需求。

Nuxt-auth 的使用可以通过配置来进行集成站点中的身份验证 [方案](/guide/scheme) 或者使用由供应商所开发，可以直接支持集成的 [DEMO](/guide/provider). 提供了重要的[API](https://auth.nuxtjs.org/) 虽然它负责在客户端 [存储信息](/api/storage) 但它不会在NuxtJS服务器上实现会话处理或提供基于会话的身份验证。


## 开始

如果是第一次使用此模块，建议按顺序阅读以下资源:

1. [添加身份验证或公共模块](./guide/setup)
2. [设置身份验证的中间件](./guide/middleware)
3. [配置本地方案](./schemes/local)
4. [自定义选项](./api/options)
5. [使用$auth服务](./api/auth)

你也可以观看VueScreencasts的视频介绍。它涵盖了相同的材料，在 Nuxt.js 项目的上下文。



[![Nuxt Auth - Authentication and Authorization in NuxtJS](https://img.youtube.com/vi/zzUpO8tXoaw/0.jpg)](https://youtu.be/zzUpO8tXoaw)

## 更多信息

- [词汇表](./glossary)
- [GitHub](https://github.com/nuxt-community/auth-module)
- [Releases](https://github.com/nuxt-community/auth-module/releases)
- [例子](https://github.com/nuxt-community/auth-module/tree/dev/demo)
- [Demo](https://nuxt-auth.herokuapp.com)
