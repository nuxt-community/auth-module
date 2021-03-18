---
title: Laravel JWT
description: This provider is for the Laravel JWT
position: 36
category: Providers
---


[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/src/providers/laravel/jwt/index.ts)

This provider is for the [Laravel JWT](https://github.com/tymondesigns/jwt-auth). Please make sure to follow our guide on the route configuration on this page to avoid issues on the authentication.

## Usage

```js
auth: {
  strategies: {
    'laravelJWT': {
      provider: 'laravel/jwt',
      url: '<laravel url>',
      endpoints: {
        ...
      },
      token: {
        property: 'access_token',
        maxAge: 60 * 60
      },
      refreshToken: {
        maxAge: 20160 * 60
      },
    },
  }
}
```

**NOTE:** It is highly recommended to use proxy to avoid CORS and same-site policy issues:

```js
{
  axios: {
    proxy: true
  },
  proxy: {
    '/laravel': {
      target: 'https://laravel-auth.nuxtjs.app',
      pathRewrite: { '^/laravel': '/' }
    }
  },
  auth: {
    strategies: {
      'laravelJWT': {
        url: '<laravel url>'
      }
    }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('laravelJWT', {
  data: {
    email: '__email__',
    password: '__password__'
  }
})
```

💁 This provider is based on [Refresh Scheme](../schemes/refresh).

### Your base `url` explained & route configuration

Following the official [Laravel JWT docs](https://jwt-auth.readthedocs.io/en/develop/quick-start/#add-some-basic-authentication-routes) you will generate the following routes:

```php

Route::group([

   'middleware' => ['api', 'auth:api'],
   'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login')->withoutMiddleware(['auth:api']);
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh')->withoutMiddleware(['auth:api']);
    Route::get('user', 'AuthController@me');

});

```

i.e.

```

login = /api/auth/login
logout = /api/auth/logout
refresh = /api/auth/refresh
user = /api/auth/user

```

### User endpoint

The docs from Laravel JWT will suggest using `/api/auth/me/` endpoints in your route. However, the defaults on Nuxt Auth is `/api/auth/user/`. Please use the route mentioned above instead.

### Token Lifetimes

Laravel JWT does not provide a refresh token; the [`token`](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php#L104) and [`refreshToken`](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php#L123) expires as define in the [Laravel JWT's config](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php).

Our provider will manage the refresh automatically based on the `token` life.

The default `token` lifetime is `1 hour` and the `refreshToken` is `2 weeks` based on the config. Make sure that your Laravel JWT config matches our Auth Nuxt Laravel JWT config as shown below:


```js
auth: {
  strategies: {
    'laravelJWT': {
      ...
      token: {
        maxAge: 60 * 60 // same as ttl but in seconds
      },
      refreshToken: {
        maxAge: 20160 * 60 // same as refresh_ttl but in seconds
      }
      ...
    }
  }
}
```
