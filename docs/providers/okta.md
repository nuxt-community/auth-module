# Okta Provider

[Source Code](https://github.com/nuxt-community/auth-module/blob/dev/lib/providers/okta.js)

## IMPORTANT NOTES:

1. This Okta Provider is designed to use the ["implicit flow"](https://oauth.net/2/grant-types/implicit/) and to always redirect to Okta.com for login and logout.

2. Okta defaults to `/implicit/callback` instead of `callback`, so you _MUST_ ensure that you _EITHER_ have a corresponding callback component (i.e. `pages/implicit/callback.vue`) _OR_ that you change your Okta settings (Applications >> \<app\> >> General >> Logout redirect URIs).

3. These instructions use the `@nuxtjs/dotenv` module extensively.  This module and approach isn't strictly necessary, but is *_highly_* recommended, particularly if you are going to be using different Okta domains or server ids across environments (e.g. for different stages of CI).

## Usage

### 1. Install dependencies
`npm install @nuxtjs/auth @nuxtjs/axios @nuxtjs/dotenv`

<details> 
  <summary>
    <strong><em>Note</em></strong>: Here are instructions for using the pull request (PR) version.
  </summary>

1. add the following to your `package.json` `dependencies`:
   ```
   "@nuxtjs/auth": "git+https://github.com/metasean/auth-module.git#okta",
   "@nuxtjs/axios": "^5.5.4",
   "@nuxtjs/dotenv": "^1.3.0",
   ```
2. run `npm install`
</details>

### 2. Create an `.env` file with the following information
```bash
# Base URL construction:
# https://${OKTA_DOMAIN}.${OKTA_URL}.com/oauth2/${OKTA_SERVER_ID}/v1


#######################################
#
# MANDATORY nuxt.config.js variables
#

# OKTA_DOMAIN
# the unique portion of your okta url, e.g.
# https://dev-012345-admin.okta.com
# nuxt.config.js - apply to `auth.strategies.okta.domain`
OKTA_DOMAIN='dev-012345'

# OKTA_CLIENT_ID
# the Client ID set by Okta
# Can be located under:
# Applications >> <app> >> General >> Client Credentials
# nuxt.config.js - apply to `auth.strategies.okta.client_id`
OKTA_CLIENT_ID='0abcde1fgHIjk2lMn345'


#######################################
#
# OPTIONAL nuxt.config.js variables
# values shown below are the default values
#

# OKTA_URL
# the base okta url
OKTA_URL='okta.com'

# OKTA_REDIRECT_CALLBACK_URI
# is the uri Okta will redirect the user to upon login
# _MUST_ also be set in Okta's
# Applications >> <app> >> General >> Login redirect URIs
# default value is '/implicit/callback'
# nuxt.config.js: apply to `auth.redirect.callback`
REDIRECT_CALLBACK_URI='/implicit/callback'

# OKTA_REDIRECT_LOGOUT_URI
# is the uri Okta will redirect the user to upon logout
# _MUST_ also be set in Okta's 
# Applications >> <app> >> General >> Logout redirect URIs
# default value is '/'
# nuxt.config.js - apply to `auth.redirect.logout`
REDIRECT_LOGOUT_URI='/'

# OKTA_SERVER_ID
# the generated portion of the url between `oauth2/` and `/v1`.
# e.g. `abcdef0ghi1JklMNO234` is the server id for https://dev-012345-admin.okta.com/oauth/abcdef0ghi1JklMNO234/v1/authorize?...
# Can be located under:
# API >> Authorization Servers
# default value is 'default'
# nuxt.config.js - apply to `auth.strategies.okta.server_id`
OKTA_SERVER_ID='default'

# OKTA_SCOPE
# Oauth2 scopes that are supported by the app
# _MUST_ also be included in Okta's 
# Applications >> <app> >> General >> Scopes
# default value is 'openid profile email'
# nuxt.config.js - apply to `auth.strategies.okta.scope`
OKTA_SCOPE='openid profile email'
```

### 3. Add the following to the `nuxt.config.js` file
```js

require('dotenv').config();

export default {
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['@nuxtjs/dotenv', { /* https://github.com/nuxt-community/dotenv-module#options */ }]
  ],

  auth: {
    redirect: {
      callback: process.env.REDIRECT_CALLBACK_URI, // optional
      logout: process.env.REDIRECT_LOGOUT_URI // optional
    },
    strategies: {
      okta: {
        url: process.env.OKTA_URL, // optional
        domain: process.env.OKTA_DOMAIN,
        client_id: process.env.OKTA_CLIENT_ID,
        server_id: process.env.OKTA_SERVER_ID, // optional
        scope: process.env.OKTA_SCOPE, // optional
      }
    }
  }
}
```

## 4. Initialize your vuex store

Create an `index.js` file in your `store` directory.  An empty `index.js` is perfectly acceptable for this purpose.

## 5. Somewhere in your application logic:

Setup your middleware (https://auth.nuxtjs.org/guide/middleware.html) and add your login, logout, etc.

```js
this.$auth.loginWith('okta')
```

E.g. `<button @click="$auth.loginWith('okta')">Login</button>`

Upon selecting the Okta login, the user will be redirected to a page like this:

<img align="center" src="../images/okta_login_redirect.png">



## Obtaining/setting Client Id, Domain, Audience, Authorization Server ID, and redirect urls

Your application needs some details about this client to communicate with Okta, and Okta needs some values set to ensure correct functionality with this module.

- `auth.strategies.okta.domain` and `auth.strategies.okta.client_id` are **REQUIRED** and **ARE SET BY OKTA**.

- `auth.redirect.callback` and `auth.redirect.logout` **MUST MATCH YOUR OKTA SETTINGS** and there must be a corresponding Nuxt `page`.
  - In both cases, the full url must be set in Okta (e.g. a "Logout Redirect URLs" for `http://localhost:3000/login`) while only the url path (e.g. `/login`) must be set in the nuxt.config.js' `auth.redirect` section.
  - Okta and the auth-nuxt okta provider both provide a default callback value of `implicit/callback`.  Therefore there must be a page `implicit/callback.vue` *_OR_* both the Okta and nuxt.config.js settings need to be changed to reflect the desired callback page.
  - Okta does *_NOT_* provide a default logout redirect, therefore it *_MUST_* be set or users will get an error on logout.  This module provides a default logout redirect value of `/`.

- `auth.strategies.okta.url` is optional and defaults to `okta.com`.
- 
- `auth.strategies.okta.server_id` is optional and defaults to `default`.

- `auth.strategies.okta.scope` is optional and defaults to `'openid profile email'`.

You can access your `auth.strategies.okta.server_id` value via:  
your Okta admin site >> "API" tab >> the "Authorization Servers" tab

You can access or set your `auth.strategies.okta.domain`, `auth.strategies.okta.client_id`, `auth.redirect.callback`, `auth.redirect.logout`, and `auth.strategies.okta.scope` values via:  
your Okta admin site >> "Applications" tab >> your specific application's "General" sub-tab

<img align="center" src="../images/YOUR_OKTA_DOMAIN--settings.png">
