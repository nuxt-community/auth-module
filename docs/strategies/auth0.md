# Auth0 Scheme

<img src="https://cdn.auth0.com/styleguide/components/1.0.8/media/logos/img/logo-grey.png" width="150">

[Auth0](https://auth0.com) is a great authentication-as-a-service platform for free!

You can use this scheme to easily add Oauth login support using auth0.

## Options

```js
auth: {
  strategies: {
    auth0: {
      clientID: 'the-client-id',
      domain: 'your-domain.auth0.com'
    }
  }
}
```

### **`clientID`** and **`domain`**

This options are **REQUIRED**. Your application needs some details about this client to communicate with Auth0. You can get these details from the Settings section for your client in the [Auth0 dashboard](https://manage.auth0.com).

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/dashboard/client_settings.png">

### `redirectUri`

A callback URL is a URL in your application where Auth0 redirects the user after they have authenticated.

If this option is not provided, URL of login (or page which initiates login) will be used.

> You need to whitelist the callback URL for your app in the Allowed Callback URLs field in your **Client Settings**. If you do not set any callback URL, your users will see a mismatch error when they log in.

## Usage

To initiate login:

```js
this.$auth.loginWith('auth0')
```

User will be redirected to a page like this:

<img align="center" src="https://cdn2.auth0.com/docs/media/articles/web/hosted-login.png">
