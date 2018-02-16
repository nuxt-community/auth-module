<h2 align="center">Schemes and Strategies</h2>

* **Schemes**: are *unconfigured* authentication provider implementations.
* **Strategies**: are *configured* Schemes.

`auth.strategies` is an Object. Keys indicate instance names and values are options.

```js
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

By default, instance name is same as strategy name. If you want more flexibility by providing **your own scheme** or having **multi instances of the same scheme** you can use `_scheme` property:

```js
auth: {
  strategies: {
    local1: { _scheme: 'local', /* ... */ },
    local2: { _scheme: 'local', /* ... */ },
    custom: { _scheme: '~/app/customStrategy.js', /* ... */ },
  }
}
```
