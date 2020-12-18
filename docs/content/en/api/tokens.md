---
title: tokens
description: Token and Refresh Token are available on `$auth.strategy.token` and `$auth.strategy.refreshToken`. Both have getters and setters and other helpers.
position: 55
category: API
---

[Token Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/inc/token.ts) and [Refresh Token Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/inc/refresh-token.ts)

**Token** and **Refresh Token** are available on `$auth.strategy.token` and `$auth.strategy.refreshToken`. Both have getters and setters and other helpers.

## Token methods

### `get()`

Universally get token.

```js
this.$auth.strategy.token.get()
```

### `set(token)`

Universally set token. It also set request header.

```js
this.$auth.strategy.token.set('...')
```

### `sync()`

Universally sync token. It also sync request header.

```js
this.$auth.strategy.token.sync()
```

### `reset()`

Universally set token to `false`.  It also clear request header.

```js
this.$auth.strategy.token.reset()
```

### `status()`

Get token status. 

```js
this.$auth.strategy.token.status()
```

#### `unknown()`

Check if status is unknown.

```js
this.$auth.strategy.token.status().unknown()
```

#### `valid()`

Check if status is valid.

```js
this.$auth.strategy.token.status().valid()
```

#### `expired()`

Check if status is expired.

```js
this.$auth.strategy.token.status().expired()
```

::: tip
Call `this.$auth.strategy.token.status()` once and assign it to a variable
:::

## Refresh Token methods

### `get()`

Universally get refresh token.

```js
this.$auth.strategy.refreshToken.get()
```

### `set(token)`

Universally set refresh token.

```js
this.$auth.strategy.refreshToken.set('...')
```

### `sync()`

Universally sync refresh token.

```js
this.$auth.strategy.refreshToken.sync()
```

### `reset()`

Universally set refresh token to `false`.

```js
this.$auth.strategy.refreshToken.reset()
```

### `status()`

Get token status. 

```js
this.$auth.strategy.refreshToken.status()
```

#### `unknown()`

Check if status is unknown.

```js
this.$auth.strategy.refreshToken.status().unknown()
```

#### `valid()`

Check if status is valid.

```js
this.$auth.strategy.refreshToken.status().valid()
```

#### `expired()`

Check if status is expired.

```js
this.$auth.strategy.refreshToken.status().expired()
```

::: tip
Call `this.$auth.strategy.refreshToken.status()` once and assign it to a variable
:::
