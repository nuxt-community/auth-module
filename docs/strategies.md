<h2 align="center">Strategies</h2>

Strategies are configured login **Scheme** instances.

`auth.strategies` is an `Object` which keys are instance name:

```js
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

By default, **instance name is same as strategy name** but if you want more flexibility  by providing **your own scheme** or having **multi instances of same scheme** you can use `_strategy` property:

```js
auth: {
  strategies: {
    local1: { _strategy: 'local', /* ... */ },
    local2: { _strategy: 'local', /* ... */ },
    custom: { _strategy: '~/app/customStrategy.js', /* ... */ },
  }
}
```
