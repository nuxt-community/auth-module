---
title: storage
description: Auth module has a built-in powerful and universal storage to keep tokens and profile data.
position: 53
category: API
---

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/core/storage.ts)

Auth module has a built-in powerful and universal storage to keep tokens and profile data.

## Universal Storage

Universally keep state in vuex, localStorage and Cookies:

```js
this.$auth.$storage.setUniversal(key, val)
this.$auth.$storage.getUniversal(key)
this.$auth.$storage.syncUniversal(key, defaultValue)
this.$auth.$storage.removeUniversal(key)
```

## Local State

Access to local state:

```js
this.$auth.$state
// OR
this.$auth.$storage.$state
```

```js
this.$auth.$storage.setState(key, val)
this.$auth.$storage.getState(key)
this.$auth.$storage.removeState(key)

// Watch state changes
this.$auth.$storage.watchState('loggedIn', newValue => { })
```

## Cookies

```js
this.$auth.$storage.getCookies()
this.$auth.$storage.setCookie(key, val, isJson)
this.$auth.$storage.getCookie(key)
this.$auth.$storage.removeCookie(key, isJson)
```

## Local Storage

```js
this.$auth.$storage.setLocalStorage(key, val)
this.$auth.$storage.getLocalStorage(key)
this.$auth.$storage.removeLocalStorage(key)
```
