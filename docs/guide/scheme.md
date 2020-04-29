# Schemes

Schemes define authentication logic. Strategy is a configurated instance of Scheme. You can have multiple schemes and strategies in your project.

`auth.strategies` option is an object. Keys are strategy name and values are configuration.

```js
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

By default, **instance names are the same as scheme names**. If you want more flexibility by providing your own scheme or having multiple instances of the same scheme you can use the `scheme` property:

```js
auth: {
  strategies: {
    local1: { scheme: 'local', /* ... */ },
    local2: { scheme: 'local', /* ... */ },
    custom: { scheme: '~/app/customStrategy.js', /* ... */ },
  }
}
```
