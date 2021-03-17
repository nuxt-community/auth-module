---
title: Schemes
description: Schemes define authentication logic. Strategy is a configured instance of Scheme. You can have multiple schemes and strategies in your project.
position: 4
category: Guide
---
Schemes define authentication logic. Strategy is a configured instance of Scheme. You can have multiple schemes and strategies in your project.

`auth.strategies` option is an object. Keys are strategy name and values are configuration.

```js{}[nuxt.config.js]
auth: {
  strategies: {
    local: { /* ... */ },
    github: { /* ... */ },
  }
}
```

By default, **instance names are the same as scheme names**. If you want more flexibility by providing your own scheme or having multiple instances of the same scheme you can use the `scheme` property:

```js{}[nuxt.config.js]
auth: {
  strategies: {
    local1: { scheme: 'local', /* ... */ },
    local2: { scheme: 'local', /* ... */ },
    custom: { scheme: '~/schemes/customStrategy', /* ... */ },
  }
}
```

## Creating your own scheme

<alert type="warning">As v5 still in development, there may be breaking changes to this feature.</alert>

Sometimes the included schemes doesn't match your requirements. Creating your own scheme will provide 
flexibility you need. You can create a new scheme from scratch or extend an existing scheme.

> **Note** A list of available scheme methods will be added in future releases.

First, create your own scheme file in `~/schemes`. You can use a different path if you want.

> In this example we will be extending `local` scheme and overriding `fetchUser` method. We will transform the user object before setting it.

```js{}[~/schemes/customScheme.js]
import { LocalScheme } from '~auth/runtime'

export default class CustomScheme extends LocalScheme {
  // Override `fetchUser` method of `local` scheme
  async fetchUser (endpoint) {
    // Token is required but not available
    if (!this.check().valid) {
      return
    }

    // User endpoint is disabled.
    if (!this.options.endpoints.user) {
      this.$auth.setUser({})
      return
    }
    
    // Try to fetch user and then set
    return this.$auth.requestWith(
      this.name,
      endpoint,
      this.options.endpoints.user
    ).then((response) => {
      const user = getProp(response.data, this.options.user.property)
      
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

      return response
    }).catch((error) => {
      this.$auth.callOnError(error, { method: 'fetchUser' })
    })
  }
}
```

Then set your new scheme in the auth config.

```js{}[nuxt.config.js]
auth: {
  strategies: {
    customStrategy: {
      scheme: '~/schemes/customScheme',
      /* ... */
    }
  }
}
```

That's it! Now you can log in using your new strategy.
```js
this.$auth.loginWith('customStrategy', { /* ... */ })
```

<alert type="success">If you think your custom scheme might be helpful to others, consider creating a GitHub Issue or Pull Request with your configuration.</alert>
