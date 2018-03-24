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


This provider automatically decodes `resource_access` from keycloak token and append it to the user object.

```
console.log(this.$auth.user)
```

```
{  
   "sub":"bcd3e199-71a8-4802-8a7a-a9d447062fc6",
   "preferred_username":"johndoe",
   "resource_access":{  
      "nuxt-frontend":{  
         "roles":[  
            "manage-users",
            "manage-posts"
         ]
      }
   }
}
```



💁 This provider is based on [oauth2 scheme](../strategies/oauth2.md) and supports all scheme options.

## More

Check official guide from [Keycloak docs.](http://www.keycloak.org/docs/latest/getting_started/index.html)


TIP: while developing, make sure to set this on your keycloak client settings tab:

- "Valid Redirect URIs" -> http://localhost:3000/*
- "Web Origins" -> http://localhost:3000