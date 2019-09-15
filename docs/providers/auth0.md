# Auth0

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/auth0.js)

[Auth0](https://auth0.com) is a great authentication-as-a-service platform for free!

## Usage

```js
auth: {
  strategies: {
    auth0: {
      domain: 'domain.auth0.com',
      client_id: '....',
      audience: 'https://my-api-domain.com/'
    }
  }
}
```

Anywhere in your application logic:

```js
this.$auth.loginWith('auth0')
```

User will be redirected to a page like this:

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/web/hosted-login.png">


💁 This provider is based on [oauth2 scheme](../schemes/oauth2.md) and supports all scheme options.

## Obtaining `client_id`, `domain`, and `audience`

`client_id` and `domain` are **REQUIRED**. Your application needs some details about this client to communicate with Auth0.

`audience` is required _unless_ you've explicitly set a default audience [on your Auth0 tenent](https://manage.auth0.com/#/tenant).

You can get your `client_id` and `domain` the Settings section for your client in the [Auth0 API dashboard](https://manage.auth0.com/#/applications). Your audience is defined on your [client's API](https://manage.auth0.com/#/apis).

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/dashboard/client_settings.png">

## Logout with new Auth0 tenants

Auth0 tenants created in 2018 and earlier had an optional tenant setting  `Enable Seamless SSO`. This setting is automatically enabled for new tenants and cannot be disabled.

If enabled and a user logs out and logs back in a short while later, they will not need to re-enter their credentials. They'll be logged in automatically. 

You can force Auth0 to present the login page:
* Go to into the `Tenant Settings` > `Advanced`
* In `Allowed Logout URLs` enter the allowed URL(s) you can redirect to, such as `http://localhost:3000`

Wherever you have a logout feature do two things:
  1. run the logout command
```js
this.$auth.logout()
```
  2. redirect the user to the Auth0 logout URL along with a `returnTo` parameter 
```
https://mytenant.auth0.com/v2/logout?returnTo=http%3A%2F%2Flocalhost:3000
```