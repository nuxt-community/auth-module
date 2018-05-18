# Keycloak Provider

The auth-module is full compliant with KEYCLOAK Oauth2 and has support to built-in token refresh.

## Usage

```js
auth: {
  strategies: {
       keycloak: {
        client_id: 'some-app-client',
        server: 'http://your-keycloak-server.com',
        realm: 'SOME-REALM'
      }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('keycloak')
```


💁 This provider is based on [oauth2 scheme](../strategies/oauth2.md) and supports all scheme options.

> TIP: You can override the default settings. See [keycloak.js](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/keycloak.js)

## More

Check official guide from [Keycloak docs.](http://www.keycloak.org/docs/latest/getting_started/index.html)


TIP: while developing, make sure to set this on your keycloak client settings tab:

- "Valid Redirect URIs" -> http://localhost:3000/*
- "Web Origins" -> http://localhost:3000