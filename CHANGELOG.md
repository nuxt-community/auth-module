# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.5.1"></a>
## [4.5.1](https://github.com/nuxt-community/auth-module/compare/v4.5.0...v4.5.1) (2018-05-21)


### Bug Fixes

* **module:** allow watchLoggedIn ([471d59f](https://github.com/nuxt-community/auth-module/commit/471d59f))



<a name="4.5.0"></a>
# [4.5.0](https://github.com/nuxt-community/auth-module/compare/v4.4.0...v4.5.0) (2018-05-21)


### Bug Fixes

* **auth:** start watching loggedIn state after current strategy is fully mounted ([#80](https://github.com/nuxt-community/auth-module/issues/80)) ([2497cc0](https://github.com/nuxt-community/auth-module/commit/2497cc0))
* **docs:** add comma following _scheme value ([#189](https://github.com/nuxt-community/auth-module/issues/189)) ([d993e01](https://github.com/nuxt-community/auth-module/commit/d993e01))

### Features

* add watchLoggedIn option to optionally disable it ([#80](https://github.com/nuxt-community/auth-module/issues/80)) ([16a7904](https://github.com/nuxt-community/auth-module/commit/16a7904))



<a name="4.4.0"></a>
# [4.4.0](https://github.com/nuxt-community/auth-module/compare/v4.3.0...v4.4.0) (2018-05-18)


### Bug Fixes

* **storage:** use false value for unsetting token/user ([#160](https://github.com/nuxt-community/auth-module/issues/160)) ([0450b57](https://github.com/nuxt-community/auth-module/commit/0450b57)), closes [nuxt-community/auth-module#133](https://github.com/nuxt-community/auth-module/issues/133)


### Features

* **oauth2:** set axios token ([#175](https://github.com/nuxt-community/auth-module/issues/175)) ([6206803](https://github.com/nuxt-community/auth-module/commit/6206803))


### Reverts

* revert [#158](https://github.com/nuxt-community/auth-module/issues/158) due to conflicts ([2afe9ca](https://github.com/nuxt-community/auth-module/commit/2afe9ca))



<a name="4.3.0"></a>
# [4.3.0](https://github.com/nuxt-community/auth-module/compare/v4.2.1...v4.3.0) (2018-04-28)


### Bug Fixes

* github provider ([#159](https://github.com/nuxt-community/auth-module/issues/159)) ([8b1819f](https://github.com/nuxt-community/auth-module/commit/8b1819f))


### Features

* laravel passport provider ([#157](https://github.com/nuxt-community/auth-module/issues/157)) ([9b09459](https://github.com/nuxt-community/auth-module/commit/9b09459))



<a name="4.2.1"></a>
## [4.2.1](https://github.com/nuxt-community/auth-module/compare/v4.2.0...v4.2.1) (2018-04-27)


### Bug Fixes

* storage cookie get on client side ([#153](https://github.com/nuxt-community/auth-module/issues/153)) ([8275e60](https://github.com/nuxt-community/auth-module/commit/8275e60))
* **watch loggedIn:** disable redirect on direct page loads ([#158](https://github.com/nuxt-community/auth-module/issues/158)) ([0386eb9](https://github.com/nuxt-community/auth-module/commit/0386eb9))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/nuxt-community/auth-module/compare/v4.1.0...v4.2.0) (2018-04-20)


### Bug Fixes

* add check for req object on getCookie ([#132](https://github.com/nuxt-community/auth-module/issues/132)) ([7d17f75](https://github.com/nuxt-community/auth-module/commit/7d17f75))
* don't redirect callback to login when using 'auth' globally ([#131](https://github.com/nuxt-community/auth-module/issues/131)) ([08d86cb](https://github.com/nuxt-community/auth-module/commit/08d86cb))
* **docs:** update redirect in options.md ([#146](https://github.com/nuxt-community/auth-module/issues/146)) ([19de22b](https://github.com/nuxt-community/auth-module/commit/19de22b))
* fullPathRedirect with query support ([#149](https://github.com/nuxt-community/auth-module/issues/149)) ([a37d599](https://github.com/nuxt-community/auth-module/commit/a37d599))
* logout locally before logging in. fixes [#136](https://github.com/nuxt-community/auth-module/issues/136). ([#151](https://github.com/nuxt-community/auth-module/issues/151)) ([b6cfad4](https://github.com/nuxt-community/auth-module/commit/b6cfad4))


### Features

* **oauth2:** support authorization code grant and refresh token ([#145](https://github.com/nuxt-community/auth-module/issues/145)) ([18ecca5](https://github.com/nuxt-community/auth-module/commit/18ecca5))
* add support for custom token key in request header ([#152](https://github.com/nuxt-community/auth-module/issues/152)) ([f7576e3](https://github.com/nuxt-community/auth-module/commit/f7576e3))



<a name="4.1.0"></a>
# [4.1.0](https://github.com/nuxt-community/auth-module/compare/v4.0.1...v4.1.0) (2018-04-09)


### Features

* **scheme/oauth2:** add option to use IdToken instead of AccessToken ([#121](https://github.com/nuxt-community/auth-module/issues/121)) ([554a042](https://github.com/nuxt-community/auth-module/commit/554a042))
* add support for logging out without an API endpoint ([#124](https://github.com/nuxt-community/auth-module/issues/124)) ([6189c6d](https://github.com/nuxt-community/auth-module/commit/6189c6d))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/nuxt-community/auth-module/compare/v4.0.0...v4.0.1) (2018-04-03)


### Bug Fixes

* **local-scheme-token:** avoid token type duplicata on Axios requests ([3908563](https://github.com/nuxt-community/auth-module/commit/3908563))
* **local-scheme-token:** removed token type from axios setToken ([c64e7f1](https://github.com/nuxt-community/auth-module/commit/c64e7f1)), closes [#113](https://github.com/nuxt-community/auth-module/issues/113)
* **scheme-resolution:** fix problem with backslashes in path to schemes on windows ([77161b8](https://github.com/nuxt-community/auth-module/commit/77161b8))
* no token exception when tokenRequired is set to false ([#118](https://github.com/nuxt-community/auth-module/issues/118)) ([56265a7](https://github.com/nuxt-community/auth-module/commit/56265a7))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.3...v4.0.0) (2018-04-02)


### Bug Fixes

* clear axios token after logout ([#84](https://github.com/nuxt-community/auth-module/issues/84)) ([be65f09](https://github.com/nuxt-community/auth-module/commit/be65f09))
* Typo in README.md ([1ec0882](https://github.com/nuxt-community/auth-module/commit/1ec0882))
* use getToken ([bec8518](https://github.com/nuxt-community/auth-module/commit/bec8518))
* wrong axios ordering in windows platform. ([#56](https://github.com/nuxt-community/auth-module/issues/56)) ([44db0d4](https://github.com/nuxt-community/auth-module/commit/44db0d4))
* **auth:** return promise reject on request error ([f2883c6](https://github.com/nuxt-community/auth-module/commit/f2883c6))
* **fetchUser:** fetchUser should only be called when enabled ([dd0638e](https://github.com/nuxt-community/auth-module/commit/dd0638e))
* **fetchUser:** fetchUser should only be called when enabled ([#60](https://github.com/nuxt-community/auth-module/issues/60)) ([beb3121](https://github.com/nuxt-community/auth-module/commit/beb3121))
* **module:** remove duplicate strategy options ([2e167f8](https://github.com/nuxt-community/auth-module/commit/2e167f8))


### Features

* add auth0-js scheme ([c38a1e4](https://github.com/nuxt-community/auth-module/commit/c38a1e4))
* **package:** add client-oauth2 ([e0efa60](https://github.com/nuxt-community/auth-module/commit/e0efa60))
* **redirect:** add full path redirect option ([#96](https://github.com/nuxt-community/auth-module/issues/96)) ([ca8785f](https://github.com/nuxt-community/auth-module/commit/ca8785f))
* allow extending auth with plugins ([#98](https://github.com/nuxt-community/auth-module/issues/98)) ([3712a60](https://github.com/nuxt-community/auth-module/commit/3712a60))
* allow providers params to be overloaded from nuxt.config.js ([#77](https://github.com/nuxt-community/auth-module/issues/77)) ([8542959](https://github.com/nuxt-community/auth-module/commit/8542959))
* handle invalid strategy ([f079ae2](https://github.com/nuxt-community/auth-module/commit/f079ae2))
* loginWith function ([2aed448](https://github.com/nuxt-community/auth-module/commit/2aed448))
* **test:** add custom _provider and _scheme for basic fixture ([7423e77](https://github.com/nuxt-community/auth-module/commit/7423e77))
* use consola for cli messages ([1db2b2e](https://github.com/nuxt-community/auth-module/commit/1db2b2e))
* user and loggedIn shortcuts ([13a5eec](https://github.com/nuxt-community/auth-module/commit/13a5eec))


### Performance Improvements

* **module:** optimize plugin ([b7998c6](https://github.com/nuxt-community/auth-module/commit/b7998c6))



<a name="4.0.0-rc.3"></a>
# [4.0.0-rc.3](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2018-02-04)


### Bug Fixes

* fix scope checks during logout ([e2ebd97](https://github.com/nuxt-community/auth-module/commit/e2ebd97))


### Features

* refactor init logic to $auth.init and improve error handling ([b58ca17](https://github.com/nuxt-community/auth-module/commit/b58ca17))



<a name="4.0.0-rc.2"></a>
# [4.0.0-rc.2](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2018-02-03)


### Bug Fixes

* **Auth:** register vuex store before all watchers ([006650f](https://github.com/nuxt-community/auth-module/commit/006650f))



<a name="4.0.0-rc.1"></a>
# [4.0.0-rc.1](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.0...v4.0.0-rc.1) (2018-02-03)


### Bug Fixes

* **deps:** update dependencies ([5d6cb8a](https://github.com/nuxt-community/auth-module/commit/5d6cb8a))
* **watcher:** close [#52](https://github.com/nuxt-community/auth-module/issues/52) and undefined bug ([2a03f2f](https://github.com/nuxt-community/auth-module/commit/2a03f2f))


### Features

* watchState and watchLoggedIn ([b628455](https://github.com/nuxt-community/auth-module/commit/b628455)), closes [#52](https://github.com/nuxt-community/auth-module/issues/52)



<a name="4.0.0-rc.0"></a>
# [4.0.0-rc.0](https://github.com/nuxt-community/auth-module/compare/v3.4.1...v4.0.0-rc.0) (2018-02-02)


### Bug Fixes

* guard check ([cf013a0](https://github.com/nuxt-community/auth-module/commit/cf013a0))
* prevent middleware infinite loops ([6ec1b34](https://github.com/nuxt-community/auth-module/commit/6ec1b34))
* ssr and code reduction ([952700c](https://github.com/nuxt-community/auth-module/commit/952700c))
* typo in lodash template ([eac33d2](https://github.com/nuxt-community/auth-module/commit/eac33d2))


### Features

* $auth.hasScope ([6d6c7b3](https://github.com/nuxt-community/auth-module/commit/6d6c7b3))
* $auth.onError ([151868a](https://github.com/nuxt-community/auth-module/commit/151868a))
* allow `token` to be a nested object in the response ([#45](https://github.com/nuxt-community/auth-module/issues/45)) ([8064839](https://github.com/nuxt-community/auth-module/commit/8064839))
* handle endpoints.propertyName ([710561b](https://github.com/nuxt-community/auth-module/commit/710561b)), closes [#46](https://github.com/nuxt-community/auth-module/issues/46)
* rewriteRedirects ([dde409a](https://github.com/nuxt-community/auth-module/commit/dde409a))
* update defaults to axios 5.x ([10157aa](https://github.com/nuxt-community/auth-module/commit/10157aa))
* use new Auth class ([d4da740](https://github.com/nuxt-community/auth-module/commit/d4da740))


### Performance Improvements

* improve cookie handling ([c50e68f](https://github.com/nuxt-community/auth-module/commit/c50e68f))


### BREAKING CHANGES

* Lot's of API and Usage changes



<a name="3.4.1"></a>
## [3.4.1](https://github.com/nuxt-community/auth-module/compare/v3.4.0...v3.4.1) (2017-12-29)


### Bug Fixes

* rc11 backward compatibility ([c0222e9](https://github.com/nuxt-community/auth-module/commit/c0222e9))



<a name="3.4.0"></a>
# [3.4.0](https://github.com/nuxt-community/auth-module/compare/v3.3.0...v3.4.0) (2017-12-29)


### Bug Fixes

* **store:** return promise in all actions ([1a9a76e](https://github.com/nuxt-community/auth-module/commit/1a9a76e))


### Features

* improve compatibility for nuxt 1.0.0 ([7740dec](https://github.com/nuxt-community/auth-module/commit/7740dec))



<a name="3.3.0"></a>
# [3.3.0](https://github.com/nuxt-community/auth-module/compare/v3.2.1...v3.3.0) (2017-12-28)


### Features

* add fetchUser option ([#27](https://github.com/nuxt-community/auth-module/issues/27)) ([1b8856c](https://github.com/nuxt-community/auth-module/commit/1b8856c))
* allow customizing http method for user endpoint ([#28](https://github.com/nuxt-community/auth-module/issues/28)) ([994152b](https://github.com/nuxt-community/auth-module/commit/994152b))
* more compatibility for nuxt@next ([d50be11](https://github.com/nuxt-community/auth-module/commit/d50be11))



<a name="3.2.1"></a>
## [3.2.1](https://github.com/nuxt-community/auth-module/compare/v3.2.0...v3.2.1) (2017-12-20)



<a name="3.2.0"></a>
# [3.2.0](https://github.com/nuxt-community/auth-module/compare/v3.1.1...v3.2.0) (2017-11-18)


### Bug Fixes

* **store:** skip only if token is not set. resolves [#20](https://github.com/nuxt-community/auth-module/issues/20). ([23b12d5](https://github.com/nuxt-community/auth-module/commit/23b12d5))


### Features

* **store:** resetOnFail option ([55e2397](https://github.com/nuxt-community/auth-module/commit/55e2397))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/nuxt-community/auth-module/compare/v3.1.0...v3.1.1) (2017-11-17)


### Bug Fixes

* **store:** better check for loggedIn ([37f22fe](https://github.com/nuxt-community/auth-module/commit/37f22fe))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/nuxt-community/auth-module/compare/v3.0.1...v3.1.0) (2017-11-15)


### Features

* **store:** let LocalStorage to be optional ([#18](https://github.com/nuxt-community/auth-module/issues/18), [@epartipilo](https://github.com/epartipilo)) ([b4086a0](https://github.com/nuxt-community/auth-module/commit/b4086a0))
* improve token options ([2a2c4c2](https://github.com/nuxt-community/auth-module/commit/2a2c4c2))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/nuxt-community/auth-module/compare/v3.0.0...v3.0.1) (2017-11-12)


### Bug Fixes

* **middleware:** redirects ([77bd1e4](https://github.com/nuxt-community/auth-module/commit/77bd1e4))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/nuxt-community/auth-module/compare/v2.0.7...v3.0.0) (2017-11-10)


### Features

* improve auth store ([499c28a](https://github.com/nuxt-community/auth-module/commit/499c28a))
* improvements ([#11](https://github.com/nuxt-community/auth-module/issues/11)) ([5d870c2](https://github.com/nuxt-community/auth-module/commit/5d870c2))


### Performance Improvements

* import only needed lodash functions ([#14](https://github.com/nuxt-community/auth-module/issues/14), [@leahci](https://github.com/leahci)Mic) ([fc6ae68](https://github.com/nuxt-community/auth-module/commit/fc6ae68))


### BREAKING CHANGES

* Some options changed and/or simplified



<a name="2.0.7"></a>
## [2.0.7](https://github.com/nuxt-community/auth-module/compare/v2.0.6...v2.0.7) (2017-10-19)



<a name="2.0.6"></a>
## [2.0.6](https://github.com/nuxt-community/auth-module/compare/v2.0.5...v2.0.6) (2017-10-19)



<a name="2.0.5"></a>
## [2.0.5](https://github.com/nuxt-community/auth-module/compare/v2.0.4...v2.0.5) (2017-09-06)


### Bug Fixes

* warn only needed ([a9dbe04](https://github.com/nuxt-community/auth-module/commit/a9dbe04))



<a name="2.0.4"></a>
## [2.0.4](https://github.com/nuxt-community/auth-module/compare/v2.0.3...v2.0.4) (2017-09-05)


### Bug Fixes

* warn when axios module is not registered ([6ace50b](https://github.com/nuxt-community/auth-module/commit/6ace50b))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/nuxt-community/auth-module/compare/v2.0.2...v2.0.3) (2017-09-04)


### Bug Fixes

* **package:** publish templates ([eb1706a](https://github.com/nuxt-community/auth-module/commit/eb1706a))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/nuxt-community/auth-module/compare/v2.0.1...v2.0.2) (2017-09-04)



<a name="2.0.1"></a>
## [2.0.1](https://github.com/nuxt-community/auth-module/compare/v0.0.1...v2.0.1) (2017-09-04)



<a name="0.0.1"></a>
## 0.0.1 (2017-09-04)
