# Schemes and Strategies

* **Schemes**: are abstract authentication provider implementations.
* **Strategies**: are configured Schemes.

`auth.strategies` option is an object. Keys are strategy name and values are configuration.

```js
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

By default, **instance name is same as scheme name**. If you want more flexibility by providing your own scheme or having multi instances of the same scheme you can use `_scheme` property:

```js
auth: {
  strategies: {
    local1: { _scheme: 'local', /* ... */ },
    local2: { _scheme: 'local', /* ... */ },
    custom: { _scheme: '~/app/customStrategy.js', /* ... */ },
  }
}
```

👉 Now that you have idea what are schemes and strategies, you can configure default [Local Scheme](schemes/local.md) and [common options](options.md).
