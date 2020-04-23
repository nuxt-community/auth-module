# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.9.0](https://github.com/nuxt-community/auth-module/compare/v4.8.5...v4.9.0) (2020-03-15)


### Features

* **core:** return response from `loginWith` ([#541](https://github.com/nuxt-community/auth-module/issues/541)) ([7e4f1ed](https://github.com/nuxt-community/auth-module/commit/7e4f1edebde7938428a80154c1fefc2fa24ff9ce)), closes [#144](https://github.com/nuxt-community/auth-module/issues/144) [#411](https://github.com/nuxt-community/auth-module/issues/411) [#249](https://github.com/nuxt-community/auth-module/issues/249)
* **local scheme:** add `autoFetchUser` option ([#543](https://github.com/nuxt-community/auth-module/issues/543)) ([344920c](https://github.com/nuxt-community/auth-module/commit/344920c0c2d90a6db6265eb286f42f64d1da6ac7))


### Bug Fixes

* clear tokens when calling `$auth.reset()` ([#544](https://github.com/nuxt-community/auth-module/issues/544)) ([ab75ebc](https://github.com/nuxt-community/auth-module/commit/ab75ebcd54d45c79d060b810cfd2ba90fd5738ac)), closes [#172](https://github.com/nuxt-community/auth-module/issues/172)
* fix `setUserToken` issues ([#528](https://github.com/nuxt-community/auth-module/issues/528)) ([02d14ac](https://github.com/nuxt-community/auth-module/commit/02d14ac5695c5797e290ce9494d0c0451fbf5296)), closes [#278](https://github.com/nuxt-community/auth-module/issues/278)
* remove the trailing slash of paths in `isSameURL` ([#542](https://github.com/nuxt-community/auth-module/issues/542)) ([fb63f6f](https://github.com/nuxt-community/auth-module/commit/fb63f6f6dc17a7afa0b3a51d4b8f447de2ede7de))
* **module:** don't log fatal error when vuex is disabled ([#518](https://github.com/nuxt-community/auth-module/issues/518)) ([59831fb](https://github.com/nuxt-community/auth-module/commit/59831fbee852ce38598a405f6cc1b971c0430339))

### [4.8.5](https://github.com/nuxt-community/auth-module/compare/v4.8.4...v4.8.5) (2019-12-27)


### Bug Fixes

* **core:** always return boolean form hasScope ([a2da3a4](https://github.com/nuxt-community/auth-module/commit/a2da3a4775266aee859c48763b3c3788efe08f02))
* **core:** support querystring only url for `isRelativeURL` ([#492](https://github.com/nuxt-community/auth-module/issues/492)) ([09d81ea](https://github.com/nuxt-community/auth-module/commit/09d81ead05c11bcd453ad59c3796987872787a12))
* **module:** always transpile nanoiid ([8ef5a9b](https://github.com/nuxt-community/auth-module/commit/8ef5a9bf6cff886be2dfc49855cf5c7c4cb1c670)), closes [#472](https://github.com/nuxt-community/auth-module/issues/472)

### [4.8.4](https://github.com/nuxt-community/auth-module/compare/v4.8.3...v4.8.4) (2019-09-12)


### Bug Fixes

* **oauth2:** restore callback handling on static sites ([#453](https://github.com/nuxt-community/auth-module/issues/453)) ([06165a0](https://github.com/nuxt-community/auth-module/commit/06165a0))

### [4.8.3](https://github.com/nuxt-community/auth-module/compare/v4.8.2...v4.8.3) (2019-09-10)


### Bug Fixes

* **core:** set loggedIn after user ([#449](https://github.com/nuxt-community/auth-module/issues/449)) ([458d60b](https://github.com/nuxt-community/auth-module/commit/458d60b))

### [4.8.2](https://github.com/nuxt-community/auth-module/compare/v4.8.1...v4.8.2) (2019-09-05)



### [4.8.1](https://github.com/nuxt-community/auth-module/compare/v4.8.0...v4.8.1) (2019-06-24)


### Bug Fixes

* **utilities:** avoid send `xxx=undefined` in query ([#387](https://github.com/nuxt-community/auth-module/issues/387)) ([7c79fd4](https://github.com/nuxt-community/auth-module/commit/7c79fd4))
* regression from [#385](https://github.com/nuxt-community/auth-module/issues/385) when callback is set to false ([#391](https://github.com/nuxt-community/auth-module/issues/391)) ([4605681](https://github.com/nuxt-community/auth-module/commit/4605681))
* **oauth2:** correctly handle callback with hash ([#394](https://github.com/nuxt-community/auth-module/issues/394)) ([9cf304f](https://github.com/nuxt-community/auth-module/commit/9cf304f))



## [4.8.0](https://github.com/nuxt-community/auth-module/compare/v4.7.0...v4.8.0) (2019-06-23)


### Bug Fixes

* don't redirect to login page if in guest mode ([#385](https://github.com/nuxt-community/auth-module/issues/385)) ([3ee609d](https://github.com/nuxt-community/auth-module/commit/3ee609d))


### Features

* **oauth2:** support server-side callback ([#381](https://github.com/nuxt-community/auth-module/issues/381)) ([af550d4](https://github.com/nuxt-community/auth-module/commit/af550d4))



## [4.7.0](https://github.com/nuxt-community/auth-module/compare/v4.6.6...v4.7.0) (2019-06-13)


### Features

* **oauth2:** support `access_type=offline` to enable refresh tokens from google ([#303](https://github.com/nuxt-community/auth-module/issues/303)) ([9553f5c](https://github.com/nuxt-community/auth-module/commit/9553f5c))



### [4.6.6](https://github.com/nuxt-community/auth-module/compare/v4.6.5...v4.6.6) (2019-06-05)


### Bug Fixes

* set-cookie header contains `undefined` value ([#372](https://github.com/nuxt-community/auth-module/issues/372)) ([323346e](https://github.com/nuxt-community/auth-module/commit/323346e))



### [4.6.5](https://github.com/nuxt-community/auth-module/compare/v4.6.4...v4.6.5) (2019-06-03)


### Bug Fixes

* fix typo in serializedCookie ([648fdc9](https://github.com/nuxt-community/auth-module/commit/648fdc9))



### [4.6.4](https://github.com/nuxt-community/auth-module/compare/v4.6.3...v4.6.4) (2019-06-03)


### Bug Fixes

* server side Set-Cookie always set an array. ([#367](https://github.com/nuxt-community/auth-module/issues/367)) ([4d3feff](https://github.com/nuxt-community/auth-module/commit/4d3feff))



### [4.6.3](https://github.com/nuxt-community/auth-module/compare/v4.6.1...v4.6.3) (2019-05-31)


### Bug Fixes

* **module:** warn if default strategy is not valid ([#365](https://github.com/nuxt-community/auth-module/issues/365)) ([db6d3d4](https://github.com/nuxt-community/auth-module/commit/db6d3d4))



### [4.6.2](https://github.com/nuxt-community/auth-module/compare/v4.6.1...v4.6.2) (2019-05-31)


### Bug Fixes

* **module:** warn if default strategy is not valid ([#365](https://github.com/nuxt-community/auth-module/issues/365)) ([db6d3d4](https://github.com/nuxt-community/auth-module/commit/db6d3d4))



### [4.6.1](https://github.com/nuxt-community/auth-module/compare/v4.6.0...v4.6.1) (2019-05-31)


### Bug Fixes

* **storage:** accept expires as a number for cookie ([dd92ec8](https://github.com/nuxt-community/auth-module/commit/dd92ec8))



## [4.6.0](https://github.com/nuxt-community/auth-module/compare/v4.5.2...v4.6.0) (2019-05-30)


### Bug Fixes

* accept state, nonce as `login` args ([e5579e9](https://github.com/nuxt-community/auth-module/commit/e5579e9))
* preserve query params when redirecting ([#193](https://github.com/nuxt-community/auth-module/issues/193)) ([39fa137](https://github.com/nuxt-community/auth-module/commit/39fa137))
* **auth:** handle mounted errors during init ([#234](https://github.com/nuxt-community/auth-module/issues/234)) ([03dba23](https://github.com/nuxt-community/auth-module/commit/03dba23))
* **docs:** GitHub capitalize ([#246](https://github.com/nuxt-community/auth-module/issues/246)) ([725e0c9](https://github.com/nuxt-community/auth-module/commit/725e0c9))
* **docs:** GitHub capitalize ([#246](https://github.com/nuxt-community/auth-module/issues/246)) ([eb7dc9e](https://github.com/nuxt-community/auth-module/commit/eb7dc9e))
* **docs:** spelling fix ([#247](https://github.com/nuxt-community/auth-module/issues/247)) ([c2b0d7b](https://github.com/nuxt-community/auth-module/commit/c2b0d7b))
* **docs:** typo ([#203](https://github.com/nuxt-community/auth-module/issues/203)) ([3a0e080](https://github.com/nuxt-community/auth-module/commit/3a0e080))
* **local:** prevent `loggedIn` being incorrectly set to true ([#346](https://github.com/nuxt-community/auth-module/issues/346)) ([aa5f29d](https://github.com/nuxt-community/auth-module/commit/aa5f29d))
* **middleware:** remove trailing slash from redirect paths ([#235](https://github.com/nuxt-community/auth-module/issues/235)) ([398a515](https://github.com/nuxt-community/auth-module/commit/398a515))
* **oauth2, auth0:** add audience to requests ([#222](https://github.com/nuxt-community/auth-module/issues/222)) ([174e135](https://github.com/nuxt-community/auth-module/commit/174e135))
* **setUserToken:** Add fallback to unimplemented strategies ([c4691ab](https://github.com/nuxt-community/auth-module/commit/c4691ab))
* randomString btoa fallback for SSR ([#230](https://github.com/nuxt-community/auth-module/issues/230)) ([604cc5d](https://github.com/nuxt-community/auth-module/commit/604cc5d))
* remove default auth0 audience ([#239](https://github.com/nuxt-community/auth-module/issues/239)) ([abfa084](https://github.com/nuxt-community/auth-module/commit/abfa084))
* set extended for body-parser urlencoded to prevent the deprecation warning ([#199](https://github.com/nuxt-community/auth-module/issues/199)) ([0226836](https://github.com/nuxt-community/auth-module/commit/0226836))
* **storage.md:** fix typo ([a8fbda8](https://github.com/nuxt-community/auth-module/commit/a8fbda8))


### Features

* improve storage ([#360](https://github.com/nuxt-community/auth-module/issues/360)) ([d05fcca](https://github.com/nuxt-community/auth-module/commit/d05fcca))
* support `onRedirect` hook ([#185](https://github.com/nuxt-community/auth-module/issues/185)) ([aacb191](https://github.com/nuxt-community/auth-module/commit/aacb191))
* **middleware:** add guest option in auth middleware ([#264](https://github.com/nuxt-community/auth-module/issues/264)) ([54b0720](https://github.com/nuxt-community/auth-module/commit/54b0720))
* generate nounce for `id_token` response type ([#298](https://github.com/nuxt-community/auth-module/issues/298)) ([b730203](https://github.com/nuxt-community/auth-module/commit/b730203))
* **oauth2:** support passing extra query params ([#358](https://github.com/nuxt-community/auth-module/issues/358)) ([0d60c2d](https://github.com/nuxt-community/auth-module/commit/0d60c2d))
* use strategy tokenName for `requestWith` ([#301](https://github.com/nuxt-community/auth-module/issues/301)) ([8654a48](https://github.com/nuxt-community/auth-module/commit/8654a48))
* **oauth2-set-state:** Allow set state in case it exists on oauth2 provider [[#253](https://github.com/nuxt-community/auth-module/issues/253)] ([6420ddc](https://github.com/nuxt-community/auth-module/commit/6420ddc))
* **setUserToken:** Add functionality to manually set auth token ([9f53a4f](https://github.com/nuxt-community/auth-module/commit/9f53a4f))
* add resetOnError ([#197](https://github.com/nuxt-community/auth-module/issues/197)) ([469f2f8](https://github.com/nuxt-community/auth-module/commit/469f2f8))



<a name="4.5.2"></a>
## [4.5.2](https://github.com/nuxt-community/auth-module/compare/v4.5.1...v4.5.2) (2018-09-18)


### Bug Fixes

* **api/auth.md:** typo([#204](https://github.com/nuxt-community/auth-module/issues/204)) ([f0e693a](https://github.com/nuxt-community/auth-module/commit/f0e693a))
* **docs:** minor proper english revisions ([#200](https://github.com/nuxt-community/auth-module/issues/200)) ([619184b](https://github.com/nuxt-community/auth-module/commit/619184b))
* **docs:** typo [#224](https://github.com/nuxt-community/auth-module/issues/224)  ([752f4ad](https://github.com/nuxt-community/auth-module/commit/752f4ad))
* **docs:** update glossary read more title ([a53c38c](https://github.com/nuxt-community/auth-module/commit/a53c38c))
* **middleware:** remove trailing slash from redirect paths ([#235](https://github.com/nuxt-community/auth-module/issues/235)) ([c401122](https://github.com/nuxt-community/auth-module/commit/c401122))



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
