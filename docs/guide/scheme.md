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

By default, **instance names are the same as scheme names**. If you want more flexibility by providing your own scheme or having multiple instances of the same scheme you can use the `_scheme` property:

```js
auth: {
  strategies: {
    local1: { _scheme: 'local', /* ... */ },
    local2: { _scheme: 'local', /* ... */ },
    custom: { _scheme: '~/app/customScheme', /* ... */ },
  }
}
```

## Creating your own scheme
Sometimes the included schemes doesn't match your requirements. Creating your own scheme will provide flexibility you need. You can create a new scheme from scratch or extend an existing scheme.

> **Note** A list of available scheme methods will be added in future releases.

Before creating custom schemes, you will need to add `@nuxtjs/auth` to `transpile`.

`nuxt.config.js`
```js
build: {
  transpile: ['@nuxtjs/auth']
}
```

With this set up, you can create your scheme file. We will be using the path below, but you can use a different path if you want.

> In this example we will be extending `local` scheme and overriding `fetchUser` method. We will transform the user object before setting it.

`~/schemes/customScheme.js`
```js
import LocalScheme from '@nuxtjs/auth/lib/schemes/local'

export default class CustomScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    // Token is required but not available
    if (this.options.tokenRequired && !this.$auth.getToken(this.name)) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }

    // Try to fetch user
    const user = await this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    )

    // Transform the user object
    const customUser = {
      ...user,
      fullName: user.firstName + ' ' + user.lastName,
      roles: ['user']
    }

    // Set the custom user
    // The `customUser` object will be accessible through `this.$auth.user`
    // Like `this.$auth.user.fullName` or `this.$auth.user.roles`
    this.$auth.setUser(customUser)
  }
}
```

Then set your new scheme in the auth config.

`nuxt.config.js`
```js
auth: {
  strategies: {
    customStrategy: {
      _scheme: '~/schemes/customScheme',
      /* ... */
    }
  }
}
```

That's it! Now you can log in using your new strategy.
```js
this.$auth.loginWith('customStrategy', { /* ... */ })
```
