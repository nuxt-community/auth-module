---
title: payload
description: Understanding the `...args` arguments in a number of `$auth`  of `loginWith`, `login`, `logout`
position: 56
category: API
---

## The 'data' property

By default `data` payload to your backend include the following properties:. 
Depending on the Scheme you are using such as `local`, `refresh`, etc... the following `data.{}` would be added based on your nuxt.config.js `auth.strategies.xxx{}`.

```json
{
    ...
    "data": {
      "client_id": "options.clientId",
      "grant_type": "options.grantType",
      "scope": "options.scope"
    },
    ...
}
```

You can add your own data `key:value` pairs for your custom login such as `username`, `email`, etc... to process in your backend.
For example when using `login` method you can do the following:

```js
this.$auth.login({
    "data": {
        "username": this.username,
    	"password": this.password
    }
});

```

## Additional Properties

As `auth.ts` is using Axios for the request you can access all the [Axios request config](https://github.com/axios/axios#request-config) to configure your request. This means you can add additional headers like the example below:

```js
this.$auth.login({
    "headers": {"X-Requested-With": "XMLHttpRequest"},
    "data": {
        "username": this.username,
    	"password": this.password
    }
});

```

These are all assigned within the `...args` in methods `loginWith`, `login` and, `logout` in your `$auth` object Class. 
