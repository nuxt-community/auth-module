# Keycloak Provider



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
