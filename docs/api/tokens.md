# tokens

[Token Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/inc/token.ts) and [Refresh Token Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/inc/refresh-token.ts)

**Token** and **Refresh Token** are available on `$auth.token` and `$auth.refreshToken`. Both have getters and setters and other helpers.

## Token methods

### `get()`

Universally get token.

```js
this.$auth.token.get()
```

### `set(token)`

Universally set token. It also set request header.

```js
this.$auth.token.set('...')
```

### `sync()`

Universally sync token. It also sync request header.

```js
this.$auth.token.sync()
```

### `reset()`

Universally set token to `false`.  It also clear request header.

```js
this.$auth.token.reset()
```

### `status()`

Get token status. 

```js
this.$auth.token.status()
```

#### `unknown()`

Check if status in unknown.

```js
this.$auth.token.status().unknown()
```

#### `valid()`

Check if status in valid.

```js
this.$auth.token.status().valid()
```

#### `expired()`

Check if status in expired.

```js
this.$auth.token.status().expired()
```

::: tip
Call `this.$auth.token.status()` once and assign it to a variable
:::

## Refresh Token methods

### `get()`

Universally get refresh token.

```js
this.$auth.refreshToken.get()
```

### `set(token)`

Universally set refresh token.

```js
this.$auth.refreshToken.set('...')
```

### `sync()`

Universally sync refresh token.

```js
this.$auth.refreshToken.sync()
```

### `reset()`

Universally set refresh token to `false`.

```js
this.$auth.refreshToken.reset()
```

### `status()`

Get token status. 

```js
this.$auth.refreshToken.status()
```

#### `unknown()`

Check if status in unknown.

```js
this.$auth.refreshToken.status().unknown()
```

#### `valid()`

Check if status in valid.

```js
this.$auth.refreshToken.status().valid()
```

#### `expired()`

Check if status in expired.

```js
this.$auth.refreshToken.status().expired()
```

::: tip
Call `this.$auth.refreshToken.status()` once and assign it to a variable
:::
