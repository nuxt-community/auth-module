# refresh controller

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

Then it will be available through the scheme

```js
mounted () {
  ...

  this.refreshController.initializeRequestInterceptor(refreshEnpoint)

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

### `initializeScheduledRefresh()`

Refreshes the token when time reaches 75% of the token expiration. It uses [refreshIn](tokens.md#refreshin) to get time intervals.

::: warning IMPORTANT
Call this function **once** from your mounted hook, **client side** only
:::

### `initializeRequestInterceptor(refreshEndpoint)`

Watch requests for token expiration and refresh tokens if token has expired.

### `reset()`

Reset properties of **RefreshController**. Call it when logging out.
