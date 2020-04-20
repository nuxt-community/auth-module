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
                maxAge: 3600
            },
        refreshToken: {
              
                required: false
            },
      },
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('laravel.jwt')
```

💁 This provider is based on [Refresh Scheme](../schemes/refresh.md).

### Your base `url` explained & route configuration

Following the official [Laravel JWT docs](https://jwt-auth.readthedocs.io/en/develop/quick-start/#add-some-basic-authentication-routes) you will generate the following routes:

```php

Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::post('user', 'AuthController@user');

});

```

i.e.

```

login = /api/auth/login
logout = /api/auth/logout
refresh = /api/auth/refresh
user = /api/auth/user

```

If you need to change these route urls, please update the endpoint urls with absolute urls e.g. `https://x...../api/auth/me`


### User endpoint

The docs from Laravel JWT will suggest using `/api/auth/me/` endpoints in your route. However, the defaults on Nuxt Auth is `/api/auth/user/`. Please use the route mentioned above instead. If not you will need to define an absolute url to the `/api/auth/me/`.

### Token Lifetimes

Laravel JWT does not provide a refresh token, it just expires as per the settings defined in the `expires_in` property as [per the docs](https://jwt-auth.readthedocs.io/en/develop/quick-start/#create-the-authcontroller).

```php
 return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
```