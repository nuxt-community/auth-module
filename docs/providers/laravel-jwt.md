# Laravel JWT

This provider is for the [Laravel JWT](https://github.com/tymondesigns/jwt-auth). Please make sure to follow our guide on the route configuration on this page to avoid issues on the authentication.

The source code of the [Laravel JWT](https://github.com/tymondesigns/jwt-auth) provider can be found below [here](https://github.com/nuxt-community/auth-module/blob/master/lib/providers/laraveljwt.js).


## Usage

```js
auth: {
  strategies: {
    'laravel.jwt': {
      url: '...insert base url...'
      endpoints: {
        ...
      },
      token: {
        property: 'access_token',
        maxAge: 60 * 60 // same as ttl but in seconds
      },
      refreshToken: {
        maxAge: 20160 * 60 // same as refresh_ttl but in seconds
      },
    },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('laravel.jwt', {
  email: '__email__',
  password: '__password__'
})
```

💁 This provider is based on [Refresh Scheme](../schemes/refresh.md).

### Your base `url` explained & route configuration

Following the official [Laravel JWT docs](https://jwt-auth.readthedocs.io/en/develop/quick-start/#add-some-basic-authentication-routes) you will generate the following routes:

```php

Route::group([

   'middleware' => ['api','auth:api'],
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

::: tip
If you need to change these route urls, please update the endpoint urls with absolute urls e.g. `https://x...../api/auth/me`
:::

### User endpoint

The docs from Laravel JWT will suggest using `/api/auth/me/` endpoints in your route. However, the defaults on Nuxt Auth is `/api/auth/user/`. Please use the route mentioned above instead. If not you will need to define an absolute url to the `/api/auth/me/`.

### Token Lifetimes

Laravel JWT does not provide a refresh token; the [`token`](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php#L104) and [`refreshToken`](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php#L123) expires as define in the [Laravel JWT's config.php](https://github.com/tymondesigns/jwt-auth/blob/develop/config/config.php).

Our provider will manage the refresh automatically based on the `token` life. 

The default `token` life time is `1 hour` and the `refreshToken` is `2 weeks` based on the config. Make sure that your laravel JWT config.php matches our Auth Nuxt Laravel JWT config as shown below:


```js
auth: {
  strategies: {
    'laravel.jwt': {
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