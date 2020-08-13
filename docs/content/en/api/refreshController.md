---
title: refresh controller
description: Refresh Controller can be initialized in a scheme to add refresh support.
position: 54
category: API
---


[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/inc/refresh-controller.ts)

**Refresh Controller** can be initialized in a scheme to add refresh support.

::: warning IMPORTANT
It can only be used inside a **scheme**.
:::

## usage

Initiate **RefreshController** in constructor

```js
export class SchemeName {
  constructor (auth, options) {
    ...

    this.refreshController = new RefreshController(this)
  }

  ...
}
```

## methods

### `handleRefresh()`

Use this method to initiate a token refresh. It returns a promise which is resolved when refresh is completed.

Multiple requests will be queued until the first has completed token refresh.

::: warning IMPORTANT
You **must** add `refreshTokens` method to your scheme in order to work.
:::
