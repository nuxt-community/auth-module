# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [6.0.1](https://github.com/yashx/auth-module/compare/v6.0.0...v6.0.1) (2022-05-16)

## [6.0.0](https://github.com/yashx/auth-module/compare/v4.9.0...v6.0.0) (2022-05-16)


### ⚠ BREAKING CHANGES

* remove build artifact from repo (#1495)

### Features

* add `Token`, `RefreshToken` and `TokenStatus` classes ([b613533](https://github.com/yashx/auth-module/commit/b61353363529585ec928bc62ffe86e1d236ba781))
* add `Token`, `RefreshToken` and `TokenStatus` classes ([5e57bd4](https://github.com/yashx/auth-module/commit/5e57bd4bacf46d4ed92d8183391d39ddfdd3d8e9))
* add discord provider ([#914](https://github.com/yashx/auth-module/issues/914)) ([5a3c3a8](https://github.com/yashx/auth-module/commit/5a3c3a8a53195618923726b70f19b2ee8336b333))
* add password grant utility and fix client id and grant type ([#602](https://github.com/yashx/auth-module/issues/602)) ([f47885c](https://github.com/yashx/auth-module/commit/f47885c6af83af08506fe05e255107ecf02edb22)), closes [#633](https://github.com/yashx/auth-module/issues/633)
* auth0 scheme ([8483fb3](https://github.com/yashx/auth-module/commit/8483fb360030734a7c4f986a5d77459b2804c45c))
* **auth:** support strategy.check ([d53d57b](https://github.com/yashx/auth-module/commit/d53d57b8998aaa0c271fc70135d4c6ac60918738))
* cookie scheme and laravel sanctum ([6b8fa2b](https://github.com/yashx/auth-module/commit/6b8fa2bee10276a2b37901fe03e4010002b4e8b7))
* cookie-scheme ([b0bfafb](https://github.com/yashx/auth-module/commit/b0bfafb5f63c7c286a9725786a872a3eb7a6c1d9))
* **cookie:** keep cookie or reponse code as token ([42f1db8](https://github.com/yashx/auth-module/commit/42f1db8e2c9419015d380c267d33f1fff445f0d7))
* **core:** add `refreshTokenAt` method ([75374e1](https://github.com/yashx/auth-module/commit/75374e14edb63f9a882a4c1f447b3520e35966fa))
* **core:** add `refreshTokenAt` method ([e432774](https://github.com/yashx/auth-module/commit/e43277436b1d3848514ebabb60f903dbfd6628b8))
* **core:** add `scheduleTokenRefresh` method ([5b133c5](https://github.com/yashx/auth-module/commit/5b133c5e8bc20545c9f848cbe84dee5d47b15caf))
* **core:** add `scheduleTokenRefresh` method ([1c474ad](https://github.com/yashx/auth-module/commit/1c474adf2f06fa020f7e3fff6101aab7beb63a09))
* **core:** add common token refresh controller ([83cb345](https://github.com/yashx/auth-module/commit/83cb34567de5148e0e5421ba151f40ade2efc901))
* **core:** add common token refresh controller ([a07c412](https://github.com/yashx/auth-module/commit/a07c412b03e777e4028eb7ca39979e73dd442f26))
* **core:** add custom exception for expired sessions ([531cc15](https://github.com/yashx/auth-module/commit/531cc15e04f183eb62a404c7ab794c60cbc5015e))
* **core:** add custom exception for expired sessions ([5f38665](https://github.com/yashx/auth-module/commit/5f386651ae788d19d394935eb9c75472a8ee0642))
* **core:** add methods `setTokenExpiration` and `setRefreshTokenExpiration` ([5fc7e87](https://github.com/yashx/auth-module/commit/5fc7e879ccd93b8312c30768601473595a8cfc4a))
* **core:** add methods `setTokenExpiration` and `setRefreshTokenExpiration` ([88bda9b](https://github.com/yashx/auth-module/commit/88bda9bddf78f2df95f67030878ee31688d3a417))
* **core:** add refresh token method ([6082652](https://github.com/yashx/auth-module/commit/608265294adbe89dcad9eb8e56e85fa88f4f2305))
* **core:** add token expiration helpers ([a42ba8e](https://github.com/yashx/auth-module/commit/a42ba8e56347a8ccefc8134c3d435f5fc00ce159))
* **core:** add token expiration helpers ([19aa116](https://github.com/yashx/auth-module/commit/19aa11610a167c904c0216846bc7a6290e54397f))
* **core:** move refresh code from utilities to its own file ([399f3ab](https://github.com/yashx/auth-module/commit/399f3ab61719e0579ab2278c70a0129eeca558ed))
* **core:** move refresh code from utilities to its own file ([238864e](https://github.com/yashx/auth-module/commit/238864e6746579c0521e8e776651f88feaf2c85d))
* **core:** use `Token` and `RefreshToken` classes ([bf84bbf](https://github.com/yashx/auth-module/commit/bf84bbf608b8a3258a6aa39aae7f0f707e157f1f))
* **core:** use `Token` and `RefreshToken` classes ([30f0194](https://github.com/yashx/auth-module/commit/30f01949eb22a794dd29e7c6ea1975b7995f7022))
* **defaults:** add `tokenExpiration` and `refreshTokenExpiration` prefixes ([8b23f57](https://github.com/yashx/auth-module/commit/8b23f57f4fc7f2b139d52735a51bd1b88d62128e))
* **defaults:** add `tokenExpiration` and `refreshTokenExpiration` prefixes ([6142403](https://github.com/yashx/auth-module/commit/61424033e7543ff547c2399b80c3684f595705a6))
* **demo:** add refresh token button ([2438182](https://github.com/yashx/auth-module/commit/243818269af740545179b56ef27c7bcfbe851b5f))
* **demo:** improve refresh endpoint ([c4f0440](https://github.com/yashx/auth-module/commit/c4f04405a55ad5e2ea83ad058123940460589096))
* deprecate `getResponseProp` ([#1006](https://github.com/yashx/auth-module/issues/1006)) ([3646657](https://github.com/yashx/auth-module/commit/364665758ef53476c60d945369e470b69981b318)), closes [#952](https://github.com/yashx/auth-module/issues/952)
* **examples:** add refresh example ([8a3340e](https://github.com/yashx/auth-module/commit/8a3340ef91cb458af161f3ef5784afb58dcc8da9))
* fixed typo in providers/google.md ([#1674](https://github.com/yashx/auth-module/issues/1674)) ([0035e52](https://github.com/yashx/auth-module/commit/0035e5243c8902a058f1a4ec1802a53ab5e4d475))
* improve `setUserToken` to set refresh token ([#721](https://github.com/yashx/auth-module/issues/721)) ([6ab4c1e](https://github.com/yashx/auth-module/commit/6ab4c1e71bb03d9a588fc82f2120cedac7588af3))
* improve module ([#922](https://github.com/yashx/auth-module/issues/922)) ([3f950ac](https://github.com/yashx/auth-module/commit/3f950ac9e3bfa9a807e8099f42f85d6fe8eb30a9))
* improve password grant flow ([#717](https://github.com/yashx/auth-module/issues/717)) ([a6f773a](https://github.com/yashx/auth-module/commit/a6f773a3aab6ca9c11cb45a25853eadcfe1824d1))
* improve token handling and validation ([#690](https://github.com/yashx/auth-module/issues/690)) ([73fd1fe](https://github.com/yashx/auth-module/commit/73fd1fe956919a29a3dd7d80c5edd976ad6aba58))
* laravel-sanctum ([bf63513](https://github.com/yashx/auth-module/commit/bf63513cbca363638d298c0fed90af2421c556a6))
* **local scheme:** initialize request interceptor in `mounted` method ([dcb82f4](https://github.com/yashx/auth-module/commit/dcb82f4a76eaeccc4d03796481f3b2e407bbc417))
* **local:** add check ([2e115bf](https://github.com/yashx/auth-module/commit/2e115bf9786504f0beaf4d05f85e080536ff16ae))
* **local:** support csrf endpoint ([6a10059](https://github.com/yashx/auth-module/commit/6a10059d5d3cbba29199e54afa6d3e5e320177aa))
* **middleware:** watch token status ([b9d0555](https://github.com/yashx/auth-module/commit/b9d05554cc3f11fd5bee06775fe158024f755f39))
* migrate from nanoid v2 to v3 ([#624](https://github.com/yashx/auth-module/issues/624)) ([6ebf1da](https://github.com/yashx/auth-module/commit/6ebf1dade7b942e8f91bd7ba01d45913f244d77e))
* **module:** copy `includes` directory ([5a49be2](https://github.com/yashx/auth-module/commit/5a49be218656224189bcfe18d4d02b88b6171dfd))
* **module:** copy `includes` directory ([caa1a97](https://github.com/yashx/auth-module/commit/caa1a97d5027ce6bf861696924cd17be06491dcc))
* non-required refresh token flow and laravel jwt provider ([#630](https://github.com/yashx/auth-module/issues/630)) ([fcde62e](https://github.com/yashx/auth-module/commit/fcde62e93a819d87586e12cc79ee2bee89eab1e0)), closes [#631](https://github.com/yashx/auth-module/issues/631) [#633](https://github.com/yashx/auth-module/issues/633) [#633](https://github.com/yashx/auth-module/issues/633)
* **oauth scheme:** return response from `refreshTokens` method ([23273ac](https://github.com/yashx/auth-module/commit/23273ac4574138eed4a6fb6d759fb53ac1f9826a))
* **oauth2 scheme:** add `check` method ([ab98561](https://github.com/yashx/auth-module/commit/ab9856155980a000bba5f76842330e16a8a91a5c))
* **oauth2 scheme:** add PKCE Grant flow support ([#507](https://github.com/yashx/auth-module/issues/507)) ([baf9b57](https://github.com/yashx/auth-module/commit/baf9b578ffe04e0d887148bec5c6585306b13a1b))
* **oauth2:** add `autoLogout` ([#657](https://github.com/yashx/auth-module/issues/657)) ([8c3a351](https://github.com/yashx/auth-module/commit/8c3a351250b77220122782a0f621af5b9001af22))
* **oauth2:** Add oauth2 refresh support ([110fdf3](https://github.com/yashx/auth-module/commit/110fdf392277529d1e4c41345cc8131948f33630))
* **oauth2:** logout support ([#613](https://github.com/yashx/auth-module/issues/613)) ([43eedc7](https://github.com/yashx/auth-module/commit/43eedc767432cbce4eb979ff56c6f52f89eabf41))
* **oauth2:** make nonce settable when response_type includes 'token' ([#709](https://github.com/yashx/auth-module/issues/709)) ([92eabbd](https://github.com/yashx/auth-module/commit/92eabbd55580302487d483bf51df6df46aad120b))
* OpenID Connect scheme ([#868](https://github.com/yashx/auth-module/issues/868)) ([d57e832](https://github.com/yashx/auth-module/commit/d57e832ce82d1870659eda7b575cc54bcb36f152))
* popup window support for oauth scheme ([#297](https://github.com/yashx/auth-module/issues/297)) ([793fbbc](https://github.com/yashx/auth-module/commit/793fbbcd29cde95b998e81167882d9368e8c6822))
* **provider-utils:** add refresh token support and fix token endpoint from addAuthorize ([#601](https://github.com/yashx/auth-module/issues/601)) ([a0bcfaa](https://github.com/yashx/auth-module/commit/a0bcfaa9f59def4289aeecc084c45e5ffcd90703))
* **refresh scheme:** add `check` method ([ce0203d](https://github.com/yashx/auth-module/commit/ce0203df9bfc9d35c94f105b0afa5bb9c3991f6b))
* **refresh scheme:** add property autoLogout to logout on mount if token has expired ([d185b6e](https://github.com/yashx/auth-module/commit/d185b6eb8fe6b7e2d1c7305e397627728f3e2511))
* **refresh scheme:** add request interceptor and refresh token expiration ([35744ea](https://github.com/yashx/auth-module/commit/35744ea3b5bd074c61969e2dec8b8516e16931a5))
* **refresh scheme:** refactor based on merged commits from `feat/refresh-core` ([9af7417](https://github.com/yashx/auth-module/commit/9af74179a74b65fb236b6211be35a644c9167713))
* **refresh scheme:** use Refresh Controller and Token Status Expiration ([ac78c31](https://github.com/yashx/auth-module/commit/ac78c3171ee669fa0c8bbcd601c401bb90897647))
* refresh support ([#361](https://github.com/yashx/auth-module/issues/361)) ([29ea6d2](https://github.com/yashx/auth-module/commit/29ea6d23a28ae1bad131ebc999efd12b99e44f8b))
* **refresh:** add `initializeRequestInterceptor` method to `RefreshController` class ([519c42e](https://github.com/yashx/auth-module/commit/519c42e9308e66b1c3d77db7756b11382cad9dad))
* **refresh:** add `initializeRequestInterceptor` method to `RefreshController` class ([b06b2a3](https://github.com/yashx/auth-module/commit/b06b2a3763aca27bacf1e64b6014104e4e244ff3))
* **request handler:** add `initializeRequestInterceptor` method ([07759c8](https://github.com/yashx/auth-module/commit/07759c883adbab130609ba498cf9c8d224eeeed4))
* **storage:** improve methods `setUniversal` and `getUniversal` ([e5a89c7](https://github.com/yashx/auth-module/commit/e5a89c78e385354bf272407eee6abab9dc2711bd))
* **storage:** improve methods `setUniversal` and `getUniversal` ([12e30ec](https://github.com/yashx/auth-module/commit/12e30ec496dff533689589b6fa8ebf8fec9dc136))
* **storage:** support custom prefix for cookie ([7dfb21e](https://github.com/yashx/auth-module/commit/7dfb21e6eabebc85dc12fb80f7bb0d7c99a1650a))
* typescript rewrite ([9fbac88](https://github.com/yashx/auth-module/commit/9fbac88191b1bdc11fec5f78da7a0bc729f5e8b8))
* **types:** declare $auth types ([99ee050](https://github.com/yashx/auth-module/commit/99ee0504fa8c626c069875ffbc99c92f62948151))
* use nuxt's base url setting ([#1023](https://github.com/yashx/auth-module/issues/1023)) ([c71a9a1](https://github.com/yashx/auth-module/commit/c71a9a1ecbcc1e8e83cb7cfc85ed115a28da122a))
* **utilities:** add token prefix utility function ([abf896f](https://github.com/yashx/auth-module/commit/abf896f38db3bb2277ffdc30abef3c30d2e73dd8))
* **utilities:** add token prefix utility function ([7744d1f](https://github.com/yashx/auth-module/commit/7744d1f1b27aaf10554e047eb57bf46cdad425c5))
* **utilities:** improve `addTokenPrefix` utility ([84f8bb7](https://github.com/yashx/auth-module/commit/84f8bb71af8f914bd7f5d602a5c4c79d315e56e9))
* **utilities:** improve `addTokenPrefix` utility ([0dc1af3](https://github.com/yashx/auth-module/commit/0dc1af3a5a2a3695a5e7b5c52c8a05514cc5382f))
* **utilities:** improve TokenExpirationStatus class ([3b0660e](https://github.com/yashx/auth-module/commit/3b0660e6098b9d4b192d146848c142c59388f4bb))
* **utilities:** improve TokenExpirationStatus class ([3c002bf](https://github.com/yashx/auth-module/commit/3c002bfc5da72437db98b9324a60e908655e7dde))


### Bug Fixes

* add compatibility to propertyName of user endpoint ([da12c9b](https://github.com/yashx/auth-module/commit/da12c9bd13dc4b3f1b2ff77b771cd91ed2f2fa2c))
* add missing `vue` import ([035aa86](https://github.com/yashx/auth-module/commit/035aa867397814eb336367dce4f9429fb9bcc415))
* add missing images ([#851](https://github.com/yashx/auth-module/issues/851)) ([d25338f](https://github.com/yashx/auth-module/commit/d25338fa6344cc85a0dfffe804df40f05ae02197))
* allow colon in relative URLs ([#1096](https://github.com/yashx/auth-module/issues/1096)) ([c356fed](https://github.com/yashx/auth-module/commit/c356fedd49d9d6e5814cfe1ba484965500a1f791))
* Allow dots on relative urls ([#1039](https://github.com/yashx/auth-module/issues/1039)) ([37b1156](https://github.com/yashx/auth-module/commit/37b1156e59c14f82fd01e076e9b56f63c1cc755a))
* **auth0:** set token and logout endpoint, and update docs ([#730](https://github.com/yashx/auth-module/issues/730)) ([6e1461a](https://github.com/yashx/auth-module/commit/6e1461a70621ed6be336a0795fc0416362ceb0ee))
* catch refresh request error ([#669](https://github.com/yashx/auth-module/issues/669)) ([18b4733](https://github.com/yashx/auth-module/commit/18b473391fa483ddf9c92e771e0608d4c6de36c3))
* check if cookies is an array ([#1353](https://github.com/yashx/auth-module/issues/1353)) ([723645a](https://github.com/yashx/auth-module/commit/723645a4fe6380f6f084fdc50f931a91743a2902))
* **cookie scheme:** force unset cookie in `reset` instead of `logout` ([64402a0](https://github.com/yashx/auth-module/commit/64402a0cfda3f6490a0b448c7cbb33fe1a32a791))
* **cookie scheme:** force unset cookie in `reset` instead of `logout` ([d249c06](https://github.com/yashx/auth-module/commit/d249c06868c10c9e823bb259932813ebe7a88ee0))
* **cookie scheme:** include parent scheme during build ([#636](https://github.com/yashx/auth-module/issues/636)) ([946f802](https://github.com/yashx/auth-module/commit/946f80245f5ed5e91d4e03e5ed635800f8af6389))
* **cookie scheme:** use `token.required` instead of `token.property` ([#952](https://github.com/yashx/auth-module/issues/952)) ([2fe2217](https://github.com/yashx/auth-module/commit/2fe2217d8fd37b7f9929b052497ca469258449e4))
* **cookie:** force unset cookie after logout ([fad1a17](https://github.com/yashx/auth-module/commit/fad1a17d0ae05671fbaaae1dfd52b57886b125f4))
* **core:** directly return response with request util ([24f2145](https://github.com/yashx/auth-module/commit/24f2145d66076dc26fe426c4ce2a79795d2f8d04))
* **core:** error handling for token refresh in middleware ([#938](https://github.com/yashx/auth-module/issues/938)) ([ec0152d](https://github.com/yashx/auth-module/commit/ec0152d347e01dadea34e22a8edd43aa1ce01365))
* **core:** fix `addTokenPrefix` method ([bb3243d](https://github.com/yashx/auth-module/commit/bb3243de91676a45dfbe1b134966b35433de03ef))
* **core:** fix `baseURL` ([#1187](https://github.com/yashx/auth-module/issues/1187)) ([87126e3](https://github.com/yashx/auth-module/commit/87126e323eef862722a6f5098f4c2355d2c23d10))
* **core:** fix baseURL for relative endpoints ([#1182](https://github.com/yashx/auth-module/issues/1182)) ([30f456c](https://github.com/yashx/auth-module/commit/30f456cfdc7d0aba65adcacff85d0c17df190f5c))
* **core:** fix set token in `setUserToken` method ([6d911b3](https://github.com/yashx/auth-module/commit/6d911b34c727329f1ef76050225b44787c1e222a))
* **core:** fix set token in `setUserToken` method ([8a53546](https://github.com/yashx/auth-module/commit/8a53546dc77203546bdf6d66c2ebb976f6d6cdd4))
* **core:** remove extra `addTokenPrefix` from `auth.js` ([66ee64e](https://github.com/yashx/auth-module/commit/66ee64e2cd69d85e7e8331141e9383fed8c4a0f7))
* **core:** remove old getProp ([dbf6499](https://github.com/yashx/auth-module/commit/dbf64993a1ef74628f17cc848b7785b512ce1634))
* **core:** reset refresh token by default ([d53338d](https://github.com/yashx/auth-module/commit/d53338d9ca7f65b5227c65c2ecee685f085bc4c5))
* **core:** return updated config if token is valid ([4cbca89](https://github.com/yashx/auth-module/commit/4cbca89f2fb7914dcfd7e8fcba8cc8b6480c1e89))
* **core:** throw error if trying to set an undefined strategy ([#628](https://github.com/yashx/auth-module/issues/628)) ([ab927f6](https://github.com/yashx/auth-module/commit/ab927f6557124802003f87a8c5da9af905ea94bd))
* **core:** warn when vuex store is not activated ([#1195](https://github.com/yashx/auth-module/issues/1195)) ([cc99959](https://github.com/yashx/auth-module/commit/cc999593a844e0594f7d373f225a1eac1191c135))
* Discord oauth2 missing "code_challenge" ([#1440](https://github.com/yashx/auth-module/issues/1440)) ([332829f](https://github.com/yashx/auth-module/commit/332829f6e43bd454843bb895b2c7eabbb0c8fa2a))
* **docs:** $storage lead to nowhere ([#1444](https://github.com/yashx/auth-module/issues/1444)) ([9a32c7d](https://github.com/yashx/auth-module/commit/9a32c7de55421b608e1a4fd6df2e4c1f8a96a50f)), closes [#1443](https://github.com/yashx/auth-module/issues/1443)
* **docs:** grammar ([#1252](https://github.com/yashx/auth-module/issues/1252)) ([72052ef](https://github.com/yashx/auth-module/commit/72052ef1a7c4156ba0ff6e7ee02f1e14fff97c3d))
* **docs:** link to user autofetch option ([#1416](https://github.com/yashx/auth-module/issues/1416)) ([1af946a](https://github.com/yashx/auth-module/commit/1af946a562c922da354807a9c0388c8d3e6a7aeb))
* eject interceptor on reset ([#689](https://github.com/yashx/auth-module/issues/689)) ([aff2175](https://github.com/yashx/auth-module/commit/aff2175f7f5abbf951d6f7839a1003d603aefd1c))
* export main file ([#993](https://github.com/yashx/auth-module/issues/993)) ([f7e00e8](https://github.com/yashx/auth-module/commit/f7e00e8e27b325efef237616e4cf278c97ab88a4))
* expose declarations in index.d.ts ([66911a8](https://github.com/yashx/auth-module/commit/66911a8deef7b108a0c64dbb0d7ebfcdde4ec31b))
* fix all imports ([daf9791](https://github.com/yashx/auth-module/commit/daf9791a1cebdad18f6e3bb0132d68e03e932b8a))
* fix lint ([0a4e4f8](https://github.com/yashx/auth-module/commit/0a4e4f8a96bc435cb7a82192b4caf9c4a9a7c5ba))
* fix lint error ([3f02691](https://github.com/yashx/auth-module/commit/3f02691825a27296c4a9fd41711d144f1392553d))
* include providers in generated types ([6087cee](https://github.com/yashx/auth-module/commit/6087cee5c07b87de6bed31223df02f7dca9053ce))
* **laravel passport:** fix default logout endpoint ([0781065](https://github.com/yashx/auth-module/commit/07810653d812e733313a8d16dad49799b4dd6bf3))
* **laravel passport:** ignore axios `baseURL` for password grant flow ([#683](https://github.com/yashx/auth-module/issues/683)) ([90a214b](https://github.com/yashx/auth-module/commit/90a214b5bdfd22d5acd35be95c78fe810dc56508))
* **laravel sanctum:** fix import of assignDefaults ([11e5089](https://github.com/yashx/auth-module/commit/11e5089ba1d9fb421d44551c1b2f8bd5ebac146a))
* **laravel sanctum:** fix provider errors ([58ebc16](https://github.com/yashx/auth-module/commit/58ebc16602a323403389c7bc53eba4ace370d4ea))
* **laravel sanctum:** fix referer header ([7d00724](https://github.com/yashx/auth-module/commit/7d0072403f7cf9b2a8c082c1c0e1c2b2fc23835a))
* **laravel sanctum:** grammar mistake ([#824](https://github.com/yashx/auth-module/issues/824)) ([695a143](https://github.com/yashx/auth-module/commit/695a14376ac748cd28a9225a6f168c5295034ce6))
* **laravel sanctum:** set `referer` header on mount ([#654](https://github.com/yashx/auth-module/issues/654)) ([26ca452](https://github.com/yashx/auth-module/commit/26ca4522bb28725bc2090adde77fef0665715910))
* **laravel-passport:** add refreshToken defaults ([#596](https://github.com/yashx/auth-module/issues/596)) ([51e89e2](https://github.com/yashx/auth-module/commit/51e89e24f7646b4c0b84ec4e2d661ad2fe5c14f1))
* **laravel, providers:** relative url for endpoints ([#633](https://github.com/yashx/auth-module/issues/633)) ([dc26782](https://github.com/yashx/auth-module/commit/dc267820c5e03b8ca5a14cf864617505ac3fe732))
* laravelSanctum provider name in demo ([3f3a2e8](https://github.com/yashx/auth-module/commit/3f3a2e89d3a24f3fde79a173e1521f4607513ffd))
* **local scheme:** add error handling for user data fetching ([#989](https://github.com/yashx/auth-module/issues/989)) ([f9cd449](https://github.com/yashx/auth-module/commit/f9cd449f444a21888137b6e89e7b247a5fd217e3))
* **local scheme:** await `reset` on mount ([fe30ab1](https://github.com/yashx/auth-module/commit/fe30ab11c234e4fee1caab0db80f1e641d16fded))
* **local scheme:** fix behaviour when token is not required ([#951](https://github.com/yashx/auth-module/issues/951)) ([551a6fb](https://github.com/yashx/auth-module/commit/551a6fb741d97f2c5f970a365186203f98c4ec71))
* **local scheme:** fix lint error ([5e86e5b](https://github.com/yashx/auth-module/commit/5e86e5bfd1f88398baad4d0524bf618d3eecb624))
* **local scheme:** force reset if token has expired in `mounted` method ([a4ab3da](https://github.com/yashx/auth-module/commit/a4ab3daa7577504baed52d884da3fc7d9a3f1fe3))
* **local scheme:** move 'syncClientId' to outside of 'tokenRequired' check ([9cb65be](https://github.com/yashx/auth-module/commit/9cb65be4117337242a88dfc153d71d648b48f32e))
* **local scheme:** remove refresh token reset ([7814500](https://github.com/yashx/auth-module/commit/7814500d6e4667b3b6721c5505dd9ecc14a57927))
* **local scheme:** remove undefined cookieOptions ([b755400](https://github.com/yashx/auth-module/commit/b7554007ce453e394221c541a336c0130fe57097))
* **local scheme:** return response and catch errors from `fetchUser` ([a36b39f](https://github.com/yashx/auth-module/commit/a36b39fdfaa3f3afb7705cdd1541b04108d904e4))
* **local:** getprop of property instead of clientId object ([#577](https://github.com/yashx/auth-module/issues/577)) ([aed2b23](https://github.com/yashx/auth-module/commit/aed2b2300a13516b1b1fff23122698d28c3824ba))
* Make invalid password error appear properly in demo ([#1274](https://github.com/yashx/auth-module/issues/1274)) ([fa80c76](https://github.com/yashx/auth-module/commit/fa80c7629593a5e1ce7b08518912340b5b169c02))
* **middleware:** fix lint (no-lonely-if) ([6b51095](https://github.com/yashx/auth-module/commit/6b5109584427a27ef8f63d0fb0950b006a5f2a5b))
* **middleware:** scheme check should be performed before "home" redirect ([#946](https://github.com/yashx/auth-module/issues/946)) ([56d457a](https://github.com/yashx/auth-module/commit/56d457a0cda9f19b4a80c9b850dfbafd7c09ccaa)), closes [#802](https://github.com/yashx/auth-module/issues/802) [#802](https://github.com/yashx/auth-module/issues/802)
* **module:** fix method `resolveProvider` ([6ff915c](https://github.com/yashx/auth-module/commit/6ff915ce203631b4664987f385fb8174bf3c2ebd))
* **module:** throw error if scheme is not defined ([#652](https://github.com/yashx/auth-module/issues/652)) ([61fb4dc](https://github.com/yashx/auth-module/commit/61fb4dcb22e277aa6872607f7d17b584011f430d))
* move config.headers set after the check ([50c0fc7](https://github.com/yashx/auth-module/commit/50c0fc70f83b45ccd8621c56c4c5f72cf56c1b33))
* **oauth refresh:** OAuth2 scheme token refresh not working server-side and silently errors out ([#849](https://github.com/yashx/auth-module/issues/849)) ([7f17cf5](https://github.com/yashx/auth-module/commit/7f17cf5e3d64cdf2f6abfe951b48679730b5677d))
* **oauth scheme:** sync token and refresh token on request ([c43e455](https://github.com/yashx/auth-module/commit/c43e455dc44a332071232af94c86902afdc73d74))
* **oauth0 provider:** remove import of `addAuthorize` ([f55b52a](https://github.com/yashx/auth-module/commit/f55b52ae8b65226edc2a9dc73b52059612bf4277))
* **oauth0 provider:** remove import of `addAuthorize` ([e56037f](https://github.com/yashx/auth-module/commit/e56037f88f95520225ce817e4f8d5fc784f58571))
* oauth2 refresh token not sending scope ([#1439](https://github.com/yashx/auth-module/issues/1439)) ([d498480](https://github.com/yashx/auth-module/commit/d4984801fe556c47bc8529b0d3bc1e90ea1ede7d))
* **oauth2 scheme:** 'reset' instead of 'logout' ([ff09125](https://github.com/yashx/auth-module/commit/ff0912555c3bef4837ad8f8b376e74c75d1de347))
* **oauth2 scheme:** `fetchUser` ignoring user.property setting ([#841](https://github.com/yashx/auth-module/issues/841)) ([b9e68dd](https://github.com/yashx/auth-module/commit/b9e68dd6e1fa9d884962386f9902ba703285ef09))
* **oauth2 scheme:** add back `refreshTokens` method and refactor it based on commits from `feat/refresh-core` ([d6fd0a8](https://github.com/yashx/auth-module/commit/d6fd0a83b92cef5744d828a9c0d0c46a73dd0479))
* **oauth2 scheme:** add backward compatibility to `token_key`, `token_type` and `refresh_token_key` ([92bdcd0](https://github.com/yashx/auth-module/commit/92bdcd0622739305238c83bfd77bcd00f02096ba))
* **oauth2 scheme:** add backward compatibility to `token_key`, `token_type` and `refresh_token_key` ([c9dd129](https://github.com/yashx/auth-module/commit/c9dd1292c4dbeb214672f359cfeb6a371190a65e))
* **oauth2 scheme:** add missing user property to options ([5772ccb](https://github.com/yashx/auth-module/commit/5772ccbde2ff32538f6562bcfc2c6576a6b5bc17))
* **oauth2 scheme:** add token and refresh token `maxAge` ([4f799c7](https://github.com/yashx/auth-module/commit/4f799c788340a2212c6c3cf09b31e93c7cfa47c9))
* **oauth2 scheme:** add token and refresh token `maxAge` ([d807413](https://github.com/yashx/auth-module/commit/d8074139adfc0430f0acf0919c50a05a79c4d55b))
* **oauth2 scheme:** check if refresh token is defined before attempting to refresh ([b1659bc](https://github.com/yashx/auth-module/commit/b1659bcefc14d4c95bf599df026281f489641db4))
* **oauth2 scheme:** check if refresh token is not expired before attempting to refresh ([bcbd63e](https://github.com/yashx/auth-module/commit/bcbd63e1038389755bf9c5b9e56b41709858d467))
* **oauth2 scheme:** fix `refreshTokens` response ([c952e95](https://github.com/yashx/auth-module/commit/c952e95164a34e40d2570d7f3dfd287cabe0d69b))
* **oauth2 scheme:** initialize request interceptor on mount ([34e6925](https://github.com/yashx/auth-module/commit/34e6925b4669969fdc4a115e8f1e799196056ef5))
* **oauth2 scheme:** Make oauth2 scheme respect `watchLoggedIn` property ([#1237](https://github.com/yashx/auth-module/issues/1237)) ([7a526bb](https://github.com/yashx/auth-module/commit/7a526bbf62f409aaed072ccc7ca46bf2a5f7a6b3))
* **oauth2 scheme:** make options extendable ([#774](https://github.com/yashx/auth-module/issues/774)) ([db756d2](https://github.com/yashx/auth-module/commit/db756d2e945842c3f3bab48fda9e22750a12cfbd))
* **oauth2 scheme:** pass token endpoint to `initializeRequestInterceptor` ([a9ae3e3](https://github.com/yashx/auth-module/commit/a9ae3e3c0762e03642ed37d16ac6a5d358383b9d))
* **oauth2 scheme:** read token property options in `refreshTokens` method ([fdc2b2c](https://github.com/yashx/auth-module/commit/fdc2b2c0b511e0b7db7fb252f9714d39b0af9ea3))
* **oauth2 scheme:** remove deprecated `name` from refresh token request ([d980279](https://github.com/yashx/auth-module/commit/d9802791ad585ff1317b78c124533ab379a008f4))
* **oauth2 scheme:** reset refresh token on `reset` ([db1b938](https://github.com/yashx/auth-module/commit/db1b938ccbe9938f5fd41fa804c113592a5d83ed))
* **oauth2 scheme:** set `token.global` to `true` ([6f7d88d](https://github.com/yashx/auth-module/commit/6f7d88d06378101ac7ae8a90791a756f2b722153))
* **oauth2 scheme:** set `token.global` to `true` ([c5694c4](https://github.com/yashx/auth-module/commit/c5694c4fd3191f12994f4844b2416e38ec0ebb6c))
* **oauth2 scheme:** unset baseURL in refreshTokens ([#939](https://github.com/yashx/auth-module/issues/939)) ([05a2348](https://github.com/yashx/auth-module/commit/05a2348ddc81a5c4f27d6183c044fe39a773fc78))
* **oauth2, refresh:** only update refresh token if defined in response ([#593](https://github.com/yashx/auth-module/issues/593)) ([95e8972](https://github.com/yashx/auth-module/commit/95e89724c096e93921385332178d13bd7cc7ceec))
* **oauth2, refresh:** remove authorization header from refreshToken call ([#576](https://github.com/yashx/auth-module/issues/576)) ([1581e03](https://github.com/yashx/auth-module/commit/1581e0384d2234a6ef184cb4941c1fa648af4f1d))
* **oauth2: scheme:** fix backward compatibility with `refresh_token_key` ([3c541bd](https://github.com/yashx/auth-module/commit/3c541bdad87d38ed535f2abb79b38defc723451e))
* **oauth2: scheme:** fix backward compatibility with `refresh_token_key` ([f7bf444](https://github.com/yashx/auth-module/commit/f7bf444a71308a1e2eceb6fafe1ab940efa27a8e))
* **oauth2:** correctly read token property options ([2350e00](https://github.com/yashx/auth-module/commit/2350e002ceacf0c0d5a280103b28ca769ac954f0))
* **oauth2:** correctly set `refreshToken` ([#563](https://github.com/yashx/auth-module/issues/563)) ([47ac372](https://github.com/yashx/auth-module/commit/47ac372d9480d5eb3d314d4197ee5eeeedebd361))
* **oauth2:** use normalized path for callback route check ([#587](https://github.com/yashx/auth-module/issues/587)) ([ffda6b0](https://github.com/yashx/auth-module/commit/ffda6b08747496a24ed4656d7d48db50e6c4c50f))
* only set authorization header when token is string ([#950](https://github.com/yashx/auth-module/issues/950)) ([ae1e5db](https://github.com/yashx/auth-module/commit/ae1e5db8abd86fa3f4678f1ac0d2e2dbff38f224))
* **openIDConnect scheme:** Check token expiration before id_token ([#1684](https://github.com/yashx/auth-module/issues/1684)) ([e616287](https://github.com/yashx/auth-module/commit/e616287f008ff3464ae24c6d7680e01001fd5c73)), closes [/github.com/nuxt-community/auth-module/pull/1684#issuecomment-1070537221](https://github.com/yashx//github.com/nuxt-community/auth-module/pull/1684/issues/issuecomment-1070537221)
* overly zealous localstorage warning ([#1430](https://github.com/yashx/auth-module/issues/1430)) ([1785b0f](https://github.com/yashx/auth-module/commit/1785b0f1facfeeab992cf4a8eb4c705845faeb09))
* prevent error when local storage isn't available ([#1415](https://github.com/yashx/auth-module/issues/1415)) ([10cfcc9](https://github.com/yashx/auth-module/commit/10cfcc9e66cffee7b789e473f95638f1ed4fdacb))
* prevent siroc overwriting ./index.d.ts ([#1400](https://github.com/yashx/auth-module/issues/1400)) ([30545a7](https://github.com/yashx/auth-module/commit/30545a78312db98e8af845542d4c152443407758))
* properties `scheme` and `name` are public ([48cd7e7](https://github.com/yashx/auth-module/commit/48cd7e7247dd8cd36834798db888f6b928a46559))
* **provider utils:** return correct error response ([#660](https://github.com/yashx/auth-module/issues/660)) ([49d4a60](https://github.com/yashx/auth-module/commit/49d4a6082c96f2b539ccfcd9effd07cb7022a677))
* **providers:** add nuxt parameter ([61f4784](https://github.com/yashx/auth-module/commit/61f4784aee90f3fc75c3d4b8d5933e49b2937fb0))
* **refresh controller:** fix sync refresh token in `initializeRequestInterceptor` method ([63ce542](https://github.com/yashx/auth-module/commit/63ce5424236195f13b6ed1b8e6f97c4f9c032fa2))
* **refresh controller:** fix sync refresh token in `initializeRequestInterceptor` method ([a451e49](https://github.com/yashx/auth-module/commit/a451e4905fdc3b4748853e7629fd1d19d7c9721b))
* **refresh example:** add missing dataGrantTypeProperty ([5e3b5de](https://github.com/yashx/auth-module/commit/5e3b5de39a640c5dc4af23c000c919347c8620df))
* **refresh example:** fix data properties ([35772af](https://github.com/yashx/auth-module/commit/35772af549f1ccd31f892c781a1a5b12623b24a6))
* **refresh scheme:** `token.required` option not taken into account ([#742](https://github.com/yashx/auth-module/issues/742)) ([71f8c11](https://github.com/yashx/auth-module/commit/71f8c113c16d2945a3a972e6742d671be65fec71))
* **refresh scheme:** add `refreshEndpoint` param to `mounted` method ([efd1c74](https://github.com/yashx/auth-module/commit/efd1c74bdc598e72d618fa1c6cfc8f96a322b344))
* **refresh scheme:** add `tokenRequired` option for refresh token ([#743](https://github.com/yashx/auth-module/issues/743)) ([63abc5f](https://github.com/yashx/auth-module/commit/63abc5fbabebe7447bdeef122895f1154e8637d5))
* **refresh scheme:** add missing `reset` param to `login` method ([e1935ad](https://github.com/yashx/auth-module/commit/e1935ad224afbba68ee9adc9a28b2d205e8e6f15))
* **refresh scheme:** allow refresh token max age to be false ([e0e2f09](https://github.com/yashx/auth-module/commit/e0e2f09daa1c2ee3bb587050bd4ac081a8f8a7ed))
* **refresh scheme:** check if refresh token is defined before attempting to refresh ([6673c23](https://github.com/yashx/auth-module/commit/6673c2335df1d8429931523bef330ab25dd7b1e9))
* **refresh scheme:** check if refresh token is not expired before attempting to refresh ([bf0a38c](https://github.com/yashx/auth-module/commit/bf0a38c11aa3ee21535ec80546ecad2f5c633412))
* **refresh scheme:** clear authorization header before refreshing ([3775892](https://github.com/yashx/auth-module/commit/3775892e80f9b1823506d34324f90b92b9c3b7d1)), closes [#716](https://github.com/yashx/auth-module/issues/716)
* **refresh scheme:** fix check of token expiration on mount ([02aac24](https://github.com/yashx/auth-module/commit/02aac240b8630dcc3c8521cc2b80a8535b6d2ffd))
* **refresh scheme:** fix check of token expiration on mount ([11332ba](https://github.com/yashx/auth-module/commit/11332baaf726b577539b078d2d74384d7b2808d8))
* **refresh scheme:** fix check of token expiration on request interceptor ([c1ceea2](https://github.com/yashx/auth-module/commit/c1ceea20e0126fa6fa01d71ac061e43b196d58cd))
* **refresh scheme:** fix code linting ([901cdfc](https://github.com/yashx/auth-module/commit/901cdfce59bfe30962a48f580a2e88e6acc3a27c))
* **refresh scheme:** fix hasRefreshTokenChanged property that was giving the opposite value ([65822b2](https://github.com/yashx/auth-module/commit/65822b283d707c1365a47a980cec6ee633ae13a7))
* **refresh scheme:** fix logout on mount ([e8ef414](https://github.com/yashx/auth-module/commit/e8ef4143ebc2d877dee1ce968110f0ad1772a0d1))
* **refresh scheme:** fix logout on mount ([c821951](https://github.com/yashx/auth-module/commit/c821951bca4dedd1b4be289923fbd4a21cbb5007))
* **refresh scheme:** fix non-required refresh token flow ([#715](https://github.com/yashx/auth-module/issues/715)) ([0948291](https://github.com/yashx/auth-module/commit/094829196cdd84e7de6a890408cbb95b1f9458e9))
* **refresh scheme:** fix reset ([02daa79](https://github.com/yashx/auth-module/commit/02daa7963531f62ddaf802934076ab4aeaa4a1be)), closes [#544](https://github.com/yashx/auth-module/issues/544)
* **refresh scheme:** fix server side error "Invalid value 'undefined' for header 'Authorization'" ([d061ad5](https://github.com/yashx/auth-module/commit/d061ad5b221d1c18b49c1ae66079fe2bc51af76a))
* **refresh scheme:** handle errors ([b2937ab](https://github.com/yashx/auth-module/commit/b2937abee9061039255452a8640de629e878edab))
* **refresh scheme:** initialize request interceptor before fetch user ([25080b0](https://github.com/yashx/auth-module/commit/25080b0937aa81b4392d5c5dae780be1d29c8937))
* **refresh scheme:** only add grantType to refresh token request if `dataGrantType` is defined ([f735c36](https://github.com/yashx/auth-module/commit/f735c3607af1b9c652e505c36e6771392fac50ca))
* **refresh scheme:** only fetch user if 'autoFetchUser' is enabled ([b4137eb](https://github.com/yashx/auth-module/commit/b4137eb85a43feefefed92aaac376dbbed1f001a))
* **refresh scheme:** pass refresh endpoint url to `initializeRequestInterceptor` ([4e62b15](https://github.com/yashx/auth-module/commit/4e62b159eba4278827c153eb27a531d8b2a18905))
* **refresh scheme:** remove error instance check ([78e1090](https://github.com/yashx/auth-module/commit/78e1090a0d5099f648fd75064672a2d502b7f071))
* **refresh scheme:** remove extra token check in `fetchUser` ([929a349](https://github.com/yashx/auth-module/commit/929a349bb6c01048c8d2281aea3f0f4abb691812))
* **refresh scheme:** remove unnecessary param ([29c678e](https://github.com/yashx/auth-module/commit/29c678e61593a049e1c6c2bfb7db8be23b20de92))
* **refresh scheme:** reset only if 'resetOnError' is enabled ([457ceac](https://github.com/yashx/auth-module/commit/457ceac2bbd6dcee3b2da7b14a8a34d92357bfad))
* **refresh scheme:** reset Refresh Controller ([b09de9a](https://github.com/yashx/auth-module/commit/b09de9a72300110d61205b7b41a36c08e3f77db8))
* **refresh scheme:** return login response ([2980892](https://github.com/yashx/auth-module/commit/298089258a80d0d40e80701468593cd4efb3e31a))
* **refresh scheme:** return response from `fetchUser` ([fe0736d](https://github.com/yashx/auth-module/commit/fe0736d3aed3313578748dbf7bfa1aec5a842d92))
* **refresh scheme:** set `refreshEndpoint` param of `login` method ([d2f5fe7](https://github.com/yashx/auth-module/commit/d2f5fe7e7cf37aa5fa89fbc759d24357d802d03a))
* **refresh scheme:** support multiple requests on request interceptor ([f129c3a](https://github.com/yashx/auth-module/commit/f129c3afbbc2358851f4c3b691366a49b89dcc47))
* **refresh scheme:** sync status before attempting to refresh ([21e40dc](https://github.com/yashx/auth-module/commit/21e40dcb7583c2e3048283a8fdef319ebeb42490))
* **refresh scheme:** sync tokens before refresh ([ee82e15](https://github.com/yashx/auth-module/commit/ee82e1556d3950f968d9020ab2063095dd67159e))
* **refresh scheme:** update header after sync tokens on request interceptor ([ea6558b](https://github.com/yashx/auth-module/commit/ea6558b93ab2b73d2e2c6e03d0108d69fa509f6a))
* **refresh scheme:** wait for refresh token request, even if token hasn't expired ([080628f](https://github.com/yashx/auth-module/commit/080628f962e327a266a9f4656d779ddd0b2e75d2))
* **refresh:** call scheme method `refreshToken` instead of `_refreshToken` ([d0e3c0e](https://github.com/yashx/auth-module/commit/d0e3c0ec6a554001c03d858b41c9a5caf4f41fa6))
* **refresh:** call scheme method `refreshToken` instead of `_refreshToken` ([f04d30b](https://github.com/yashx/auth-module/commit/f04d30b6e6efde318ce25e286a6e610c13b1f39f))
* **refresh:** clear refresh interval before schedule new token refresh ([9aa623a](https://github.com/yashx/auth-module/commit/9aa623a82545b6cd38bf5ca85c47f0cac3481b0f))
* **refresh:** clear refresh interval before schedule new token refresh ([862d184](https://github.com/yashx/auth-module/commit/862d184f07fed4de5ca5b2b3e4c24f4c6526ffc9))
* **refresh:** fix `_tokenExpiresAt` property ([9fbfc82](https://github.com/yashx/auth-module/commit/9fbfc82ee3ffff89215cf77acde2c5c50d1c8c58))
* **refresh:** fix `_tokenExpiresAt` property ([30179b3](https://github.com/yashx/auth-module/commit/30179b360beb0143add049abc3787b9da631aad7))
* **refresh:** fix import of `getProp` and `ExpiredAuthSessionError` ([ba19636](https://github.com/yashx/auth-module/commit/ba19636568b99fdd9346ed601aa41720ba33ae92))
* **refresh:** fix import of `getProp` and `ExpiredAuthSessionError` ([aaeaeb8](https://github.com/yashx/auth-module/commit/aaeaeb8b30ca9d3bfb8ce83bac8de08b1f25c930))
* **refresh:** initialize request Interceptor if `autoRefresh` is enabled ([9366570](https://github.com/yashx/auth-module/commit/9366570624230b640331bd22d1a27d75b66d9f6d))
* **refresh:** initialize request Interceptor if `autoRefresh` is enabled ([32c114c](https://github.com/yashx/auth-module/commit/32c114c7f9cbe04debfdc2fb5f262d651d7b1371))
* **refresh:** pass `config` param to `requestHasAuthorizationHeader` check ([a9d3f6c](https://github.com/yashx/auth-module/commit/a9d3f6c302e37c3149cf80cb912a1c3faa8f9d66))
* **refresh:** pass `config` param to `requestHasAuthorizationHeader` check ([39fd5bc](https://github.com/yashx/auth-module/commit/39fd5bc3ba760c97779845b2cd17bb40b69b4fd0))
* **refresh:** prevent scheduled refresh from being executed in server side ([396518e](https://github.com/yashx/auth-module/commit/396518e818bdec12059279164d2fa5844d25a27e))
* **refresh:** prevent scheduled refresh from being executed in server side ([eb38fd4](https://github.com/yashx/auth-module/commit/eb38fd4f05cc717690a66c98088904861fca5b62))
* **refresh:** reset refresh timer if refreshToken is called manually ([c892cc9](https://github.com/yashx/auth-module/commit/c892cc94a83982c9e06d9c96c961c9e803cbe027))
* **refresh:** this.scheme instead of this.$scheme ([1df462a](https://github.com/yashx/auth-module/commit/1df462ad517b7f621bc508f91ae5f37f3ea91035))
* **refresh:** this.scheme instead of this.$scheme ([9fef2a2](https://github.com/yashx/auth-module/commit/9fef2a261bf4d2bb0a2a5335064298a31c26c395))
* **request handler:** only intercept requests if global token is enabled ([#695](https://github.com/yashx/auth-module/issues/695)) ([1671dba](https://github.com/yashx/auth-module/commit/1671dba3d5b95947002813b4b2b39c167220992d))
* **resolve:** get strategies from `options.strategies` ([cffa385](https://github.com/yashx/auth-module/commit/cffa385f061c8d7bec124c6f10c599e064980669))
* **resolve:** properly resolve schemes and providers ([30d8479](https://github.com/yashx/auth-module/commit/30d8479b8d5f04c84bfebf1e7f4dbc3f99775588))
* return response from `refreshToken` method ([98a2a6b](https://github.com/yashx/auth-module/commit/98a2a6be40c850a3f16661fc579c3f01c49541aa))
* **schemes:** check if `clientId` is defined before attempting to reset it ([b68de9f](https://github.com/yashx/auth-module/commit/b68de9f82172a4966e82bf641f3dc46f9e97d364))
* **schemes:** fix client id prefix ([0af3e7e](https://github.com/yashx/auth-module/commit/0af3e7e4a3e07d8f49edaa1d5ffedf4316ab70a0))
* **schemes:** move `DEFAULTS` to top ([8e4879c](https://github.com/yashx/auth-module/commit/8e4879c7a9076d30923060f060ef19da12f6227c))
* **schemes:** properly check `clientId` and `grantType` ([9e50a6c](https://github.com/yashx/auth-module/commit/9e50a6c99689a9b200ca56af316db1ef0d051c54))
* set "false" as default value of "getUniversal" method ([9d332ee](https://github.com/yashx/auth-module/commit/9d332ee4d54ee1aef16b7a652d24708af3c5f900))
* set maxRedirects to 0 for csrf ([a16c5c6](https://github.com/yashx/auth-module/commit/a16c5c613b68e38bb49d55a82d858af62efb66d6))
* Setting cookie: false is not respected ([#1442](https://github.com/yashx/auth-module/issues/1442)) ([f4d0554](https://github.com/yashx/auth-module/commit/f4d05546b755c7bf0d8c3763956db58f44c324e9))
* **storage:** fix `getUniversal` in server side ([a440961](https://github.com/yashx/auth-module/commit/a4409610d03b01e7c1ab4bfb9755db35954dfea4))
* **storage:** improve `setCookie` to prevent duplicated cookies ([#718](https://github.com/yashx/auth-module/issues/718)) ([3f0073b](https://github.com/yashx/auth-module/commit/3f0073bc341c1bd19c3da1db6034f42e9414dfb7))
* **token and refresh token:** set type of `jwt-decode` payload ([#918](https://github.com/yashx/auth-module/issues/918)) ([ce5a056](https://github.com/yashx/auth-module/commit/ce5a05687c738ce5380115110955f06b97e5be14))
* **token:** fix methods `getStatus` ([f644e46](https://github.com/yashx/auth-module/commit/f644e461611504b1d656774b95aea78c15ec0b27))
* **token:** fix methods `getStatus` ([841ed1c](https://github.com/yashx/auth-module/commit/841ed1ccfa9232f9b339ba0ac63891d3026cbaed))
* **token:** fix methods `setHeader` and `clearHeader` ([fc6b242](https://github.com/yashx/auth-module/commit/fc6b24256778aa3d8493fa39b66255814d0ab0a7))
* **token:** fix methods `setHeader` and `clearHeader` ([342320c](https://github.com/yashx/auth-module/commit/342320c390c1e817c1c0fd61e7a8889bba250461))
* **token:** fix strategy options ([80c2cfa](https://github.com/yashx/auth-module/commit/80c2cfab17ccdda2daf1e79887b0d16e24985ca4))
* **token:** fix strategy options ([994db50](https://github.com/yashx/auth-module/commit/994db505affca96001ed607efb135c91c9bc3f7d))
* **tokens:** if `_tokenTTLMillis` is not defined `_tokenExpiresAtMillis` return `0` ([b27591e](https://github.com/yashx/auth-module/commit/b27591e2a51be49879bf67443770f486242fc8f7))
* **tokens:** if `_tokenTTLMillis` is not defined `_tokenExpiresAtMillis` return `0` ([4dfdadb](https://github.com/yashx/auth-module/commit/4dfdadb4986cf7e4ac4c940badc93a5b1d82ebbb))
* types ([799e5cc](https://github.com/yashx/auth-module/commit/799e5cc88e71fdb0df13c76670cee705d5525536))
* **types:** Allow boolean types for redirect options ([#1361](https://github.com/yashx/auth-module/issues/1361)) ([a0643c3](https://github.com/yashx/auth-module/commit/a0643c30fe21df9164b46f66a51202090dde6606))
* **types:** fix typings for vuex ([eba51b3](https://github.com/yashx/auth-module/commit/eba51b36c86b573adbeed3bfb96464cbb3741968))
* **types:** revert [#1361](https://github.com/yashx/auth-module/issues/1361) due to type errors ([#1489](https://github.com/yashx/auth-module/issues/1489)) ([536f556](https://github.com/yashx/auth-module/commit/536f556e6549a58755daeb6529e42f7f5c5a3888))
* unsupported package.json comment ([647248d](https://github.com/yashx/auth-module/commit/647248df19d2fdd137cf7ead758e7a68ba73b68e))
* use customizable property instead of getRealName ([6cdb8fa](https://github.com/yashx/auth-module/commit/6cdb8fab461d73ff13c9a6f96fd744498931d9b2))
* **utilities:** export `addTokenPrefix` method ([5ef957b](https://github.com/yashx/auth-module/commit/5ef957b133e6163db31dd44f08bb43b091a0389b))
* **utilities:** export `addTokenPrefix` method ([772b59b](https://github.com/yashx/auth-module/commit/772b59bbc3ddd56efa4d43c3df4a98f0a00f320a))
* **utilities:** only `throw error` if `error` is not instance of `InvalidTokenError` ([06af6e8](https://github.com/yashx/auth-module/commit/06af6e85a8b2b2f33d1f53e0d8db80bec8f10f3c))
* **utilities:** only `throw error` if `error` is not instance of `InvalidTokenError` ([09d65be](https://github.com/yashx/auth-module/commit/09d65be13391df2cfe9b14f18e695d9bb0500453))
* **utilities:** only set `tokenExpiration` to its fallback if error instance of `InvalidTokenError` ([75e59a1](https://github.com/yashx/auth-module/commit/75e59a1a54e040fff989439421aa47c237de92c8))
* **utilities:** only set `tokenExpiration` to its fallback if error instance of `InvalidTokenError` ([20ed936](https://github.com/yashx/auth-module/commit/20ed936aa50553187e1fa50372c7470c1b0fb5eb))
* **utilities:** prevent `startsWith` error if token is undefined ([5448664](https://github.com/yashx/auth-module/commit/544866456489c877a2467044f10d27f754ad05ba))
* **utilities:** set `tokenExpiration` to `false` if `_tokenExpiresAt` is undefined ([bbbd025](https://github.com/yashx/auth-module/commit/bbbd025640f5e42f52fcac8615a92403dbe784c9))
* **utilities:** set `tokenExpiration` to `false` if `_tokenExpiresAt` is undefined ([22a70bb](https://github.com/yashx/auth-module/commit/22a70bbd6804ab01977579aeb81c4baec384b896))
* **utilities:** simplify check of `tokenExpiresAt` ([84b3a33](https://github.com/yashx/auth-module/commit/84b3a33888edea66c11fff5c0a05cff1ca8f2fad))
* **utilities:** simplify check of `tokenExpiresAt` ([4c80f79](https://github.com/yashx/auth-module/commit/4c80f796b177a8ec7612b38907b688c7b25450be))
* **utils:** check if `holder` is `object` in `getProp` util ([#941](https://github.com/yashx/auth-module/issues/941)) ([23ecb31](https://github.com/yashx/auth-module/commit/23ecb31943d8aab25fa325d06d517b0c565c2d9a))


* remove build artifact from repo ([#1495](https://github.com/yashx/auth-module/issues/1495)) ([d38a8d7](https://github.com/yashx/auth-module/commit/d38a8d7027c3638baef27a4862b9e1b7ea1db941))

## [4.9.0](https://github.com/nuxt-community/auth-module/compare/v4.8.5...v4.9.0) (2020-03-15)

### Features

- **core:** return response from `loginWith` ([#541](https://github.com/nuxt-community/auth-module/issues/541)) ([7e4f1ed](https://github.com/nuxt-community/auth-module/commit/7e4f1edebde7938428a80154c1fefc2fa24ff9ce)), closes [#144](https://github.com/nuxt-community/auth-module/issues/144) [#411](https://github.com/nuxt-community/auth-module/issues/411) [#249](https://github.com/nuxt-community/auth-module/issues/249)
- **local scheme:** add `autoFetchUser` option ([#543](https://github.com/nuxt-community/auth-module/issues/543)) ([344920c](https://github.com/nuxt-community/auth-module/commit/344920c0c2d90a6db6265eb286f42f64d1da6ac7))

### Bug Fixes

- clear tokens when calling `$auth.reset()` ([#544](https://github.com/nuxt-community/auth-module/issues/544)) ([ab75ebc](https://github.com/nuxt-community/auth-module/commit/ab75ebcd54d45c79d060b810cfd2ba90fd5738ac)), closes [#172](https://github.com/nuxt-community/auth-module/issues/172)
- fix `setUserToken` issues ([#528](https://github.com/nuxt-community/auth-module/issues/528)) ([02d14ac](https://github.com/nuxt-community/auth-module/commit/02d14ac5695c5797e290ce9494d0c0451fbf5296)), closes [#278](https://github.com/nuxt-community/auth-module/issues/278)
- remove the trailing slash of paths in `isSameURL` ([#542](https://github.com/nuxt-community/auth-module/issues/542)) ([fb63f6f](https://github.com/nuxt-community/auth-module/commit/fb63f6f6dc17a7afa0b3a51d4b8f447de2ede7de))
- **module:** don't log fatal error when vuex is disabled ([#518](https://github.com/nuxt-community/auth-module/issues/518)) ([59831fb](https://github.com/nuxt-community/auth-module/commit/59831fbee852ce38598a405f6cc1b971c0430339))

### [4.8.5](https://github.com/nuxt-community/auth-module/compare/v4.8.4...v4.8.5) (2019-12-27)

### Bug Fixes

- **core:** always return boolean form hasScope ([a2da3a4](https://github.com/nuxt-community/auth-module/commit/a2da3a4775266aee859c48763b3c3788efe08f02))
- **core:** support querystring only url for `isRelativeURL` ([#492](https://github.com/nuxt-community/auth-module/issues/492)) ([09d81ea](https://github.com/nuxt-community/auth-module/commit/09d81ead05c11bcd453ad59c3796987872787a12))
- **module:** always transpile nanoiid ([8ef5a9b](https://github.com/nuxt-community/auth-module/commit/8ef5a9bf6cff886be2dfc49855cf5c7c4cb1c670)), closes [#472](https://github.com/nuxt-community/auth-module/issues/472)

### [4.8.4](https://github.com/nuxt-community/auth-module/compare/v4.8.3...v4.8.4) (2019-09-12)

### Bug Fixes

- **oauth2:** restore callback handling on static sites ([#453](https://github.com/nuxt-community/auth-module/issues/453)) ([06165a0](https://github.com/nuxt-community/auth-module/commit/06165a0))

### [4.8.3](https://github.com/nuxt-community/auth-module/compare/v4.8.2...v4.8.3) (2019-09-10)

### Bug Fixes

- **core:** set loggedIn after user ([#449](https://github.com/nuxt-community/auth-module/issues/449)) ([458d60b](https://github.com/nuxt-community/auth-module/commit/458d60b))

### [4.8.2](https://github.com/nuxt-community/auth-module/compare/v4.8.1...v4.8.2) (2019-09-05)

### [4.8.1](https://github.com/nuxt-community/auth-module/compare/v4.8.0...v4.8.1) (2019-06-24)

### Bug Fixes

- **utilities:** avoid send `xxx=undefined` in query ([#387](https://github.com/nuxt-community/auth-module/issues/387)) ([7c79fd4](https://github.com/nuxt-community/auth-module/commit/7c79fd4))
- regression from [#385](https://github.com/nuxt-community/auth-module/issues/385) when callback is set to false ([#391](https://github.com/nuxt-community/auth-module/issues/391)) ([4605681](https://github.com/nuxt-community/auth-module/commit/4605681))
- **oauth2:** correctly handle callback with hash ([#394](https://github.com/nuxt-community/auth-module/issues/394)) ([9cf304f](https://github.com/nuxt-community/auth-module/commit/9cf304f))

## [4.8.0](https://github.com/nuxt-community/auth-module/compare/v4.7.0...v4.8.0) (2019-06-23)

### Bug Fixes

- don't redirect to login page if in guest mode ([#385](https://github.com/nuxt-community/auth-module/issues/385)) ([3ee609d](https://github.com/nuxt-community/auth-module/commit/3ee609d))

### Features

- **oauth2:** support server-side callback ([#381](https://github.com/nuxt-community/auth-module/issues/381)) ([af550d4](https://github.com/nuxt-community/auth-module/commit/af550d4))

## [4.7.0](https://github.com/nuxt-community/auth-module/compare/v4.6.6...v4.7.0) (2019-06-13)

### Features

- **oauth2:** support `access_type=offline` to enable refresh tokens from google ([#303](https://github.com/nuxt-community/auth-module/issues/303)) ([9553f5c](https://github.com/nuxt-community/auth-module/commit/9553f5c))

### [4.6.6](https://github.com/nuxt-community/auth-module/compare/v4.6.5...v4.6.6) (2019-06-05)

### Bug Fixes

- set-cookie header contains `undefined` value ([#372](https://github.com/nuxt-community/auth-module/issues/372)) ([323346e](https://github.com/nuxt-community/auth-module/commit/323346e))

### [4.6.5](https://github.com/nuxt-community/auth-module/compare/v4.6.4...v4.6.5) (2019-06-03)

### Bug Fixes

- fix typo in serializedCookie ([648fdc9](https://github.com/nuxt-community/auth-module/commit/648fdc9))

### [4.6.4](https://github.com/nuxt-community/auth-module/compare/v4.6.3...v4.6.4) (2019-06-03)

### Bug Fixes

- server side Set-Cookie always set an array. ([#367](https://github.com/nuxt-community/auth-module/issues/367)) ([4d3feff](https://github.com/nuxt-community/auth-module/commit/4d3feff))

### [4.6.3](https://github.com/nuxt-community/auth-module/compare/v4.6.1...v4.6.3) (2019-05-31)

### Bug Fixes

- **module:** warn if default strategy is not valid ([#365](https://github.com/nuxt-community/auth-module/issues/365)) ([db6d3d4](https://github.com/nuxt-community/auth-module/commit/db6d3d4))

### [4.6.2](https://github.com/nuxt-community/auth-module/compare/v4.6.1...v4.6.2) (2019-05-31)

### Bug Fixes

- **module:** warn if default strategy is not valid ([#365](https://github.com/nuxt-community/auth-module/issues/365)) ([db6d3d4](https://github.com/nuxt-community/auth-module/commit/db6d3d4))

### [4.6.1](https://github.com/nuxt-community/auth-module/compare/v4.6.0...v4.6.1) (2019-05-31)

### Bug Fixes

- **storage:** accept expires as a number for cookie ([dd92ec8](https://github.com/nuxt-community/auth-module/commit/dd92ec8))

## [4.6.0](https://github.com/nuxt-community/auth-module/compare/v4.5.2...v4.6.0) (2019-05-30)

### Bug Fixes

- accept state, nonce as `login` args ([e5579e9](https://github.com/nuxt-community/auth-module/commit/e5579e9))
- preserve query params when redirecting ([#193](https://github.com/nuxt-community/auth-module/issues/193)) ([39fa137](https://github.com/nuxt-community/auth-module/commit/39fa137))
- **auth:** handle mounted errors during init ([#234](https://github.com/nuxt-community/auth-module/issues/234)) ([03dba23](https://github.com/nuxt-community/auth-module/commit/03dba23))
- **docs:** GitHub capitalize ([#246](https://github.com/nuxt-community/auth-module/issues/246)) ([725e0c9](https://github.com/nuxt-community/auth-module/commit/725e0c9))
- **docs:** GitHub capitalize ([#246](https://github.com/nuxt-community/auth-module/issues/246)) ([eb7dc9e](https://github.com/nuxt-community/auth-module/commit/eb7dc9e))
- **docs:** spelling fix ([#247](https://github.com/nuxt-community/auth-module/issues/247)) ([c2b0d7b](https://github.com/nuxt-community/auth-module/commit/c2b0d7b))
- **docs:** typo ([#203](https://github.com/nuxt-community/auth-module/issues/203)) ([3a0e080](https://github.com/nuxt-community/auth-module/commit/3a0e080))
- **local:** prevent `loggedIn` being incorrectly set to true ([#346](https://github.com/nuxt-community/auth-module/issues/346)) ([aa5f29d](https://github.com/nuxt-community/auth-module/commit/aa5f29d))
- **middleware:** remove trailing slash from redirect paths ([#235](https://github.com/nuxt-community/auth-module/issues/235)) ([398a515](https://github.com/nuxt-community/auth-module/commit/398a515))
- **oauth2, auth0:** add audience to requests ([#222](https://github.com/nuxt-community/auth-module/issues/222)) ([174e135](https://github.com/nuxt-community/auth-module/commit/174e135))
- **setUserToken:** Add fallback to unimplemented strategies ([c4691ab](https://github.com/nuxt-community/auth-module/commit/c4691ab))
- randomString btoa fallback for SSR ([#230](https://github.com/nuxt-community/auth-module/issues/230)) ([604cc5d](https://github.com/nuxt-community/auth-module/commit/604cc5d))
- remove default auth0 audience ([#239](https://github.com/nuxt-community/auth-module/issues/239)) ([abfa084](https://github.com/nuxt-community/auth-module/commit/abfa084))
- set extended for body-parser urlencoded to prevent the deprecation warning ([#199](https://github.com/nuxt-community/auth-module/issues/199)) ([0226836](https://github.com/nuxt-community/auth-module/commit/0226836))
- **storage.md:** fix typo ([a8fbda8](https://github.com/nuxt-community/auth-module/commit/a8fbda8))

### Features

- improve storage ([#360](https://github.com/nuxt-community/auth-module/issues/360)) ([d05fcca](https://github.com/nuxt-community/auth-module/commit/d05fcca))
- support `onRedirect` hook ([#185](https://github.com/nuxt-community/auth-module/issues/185)) ([aacb191](https://github.com/nuxt-community/auth-module/commit/aacb191))
- **middleware:** add guest option in auth middleware ([#264](https://github.com/nuxt-community/auth-module/issues/264)) ([54b0720](https://github.com/nuxt-community/auth-module/commit/54b0720))
- generate nounce for `id_token` response type ([#298](https://github.com/nuxt-community/auth-module/issues/298)) ([b730203](https://github.com/nuxt-community/auth-module/commit/b730203))
- **oauth2:** support passing extra query params ([#358](https://github.com/nuxt-community/auth-module/issues/358)) ([0d60c2d](https://github.com/nuxt-community/auth-module/commit/0d60c2d))
- use strategy tokenName for `requestWith` ([#301](https://github.com/nuxt-community/auth-module/issues/301)) ([8654a48](https://github.com/nuxt-community/auth-module/commit/8654a48))
- **oauth2-set-state:** Allow set state in case it exists on oauth2 provider [[#253](https://github.com/nuxt-community/auth-module/issues/253)] ([6420ddc](https://github.com/nuxt-community/auth-module/commit/6420ddc))
- **setUserToken:** Add functionality to manually set auth token ([9f53a4f](https://github.com/nuxt-community/auth-module/commit/9f53a4f))
- add resetOnError ([#197](https://github.com/nuxt-community/auth-module/issues/197)) ([469f2f8](https://github.com/nuxt-community/auth-module/commit/469f2f8))

<a name="4.5.2"></a>

## [4.5.2](https://github.com/nuxt-community/auth-module/compare/v4.5.1...v4.5.2) (2018-09-18)

### Bug Fixes

- **api/auth.md:** typo([#204](https://github.com/nuxt-community/auth-module/issues/204)) ([f0e693a](https://github.com/nuxt-community/auth-module/commit/f0e693a))
- **docs:** minor proper english revisions ([#200](https://github.com/nuxt-community/auth-module/issues/200)) ([619184b](https://github.com/nuxt-community/auth-module/commit/619184b))
- **docs:** typo [#224](https://github.com/nuxt-community/auth-module/issues/224) ([752f4ad](https://github.com/nuxt-community/auth-module/commit/752f4ad))
- **docs:** update glossary read more title ([a53c38c](https://github.com/nuxt-community/auth-module/commit/a53c38c))
- **middleware:** remove trailing slash from redirect paths ([#235](https://github.com/nuxt-community/auth-module/issues/235)) ([c401122](https://github.com/nuxt-community/auth-module/commit/c401122))

<a name="4.5.1"></a>

## [4.5.1](https://github.com/nuxt-community/auth-module/compare/v4.5.0...v4.5.1) (2018-05-21)

### Bug Fixes

- **module:** allow watchLoggedIn ([471d59f](https://github.com/nuxt-community/auth-module/commit/471d59f))

<a name="4.5.0"></a>

# [4.5.0](https://github.com/nuxt-community/auth-module/compare/v4.4.0...v4.5.0) (2018-05-21)

### Bug Fixes

- **auth:** start watching loggedIn state after current strategy is fully mounted ([#80](https://github.com/nuxt-community/auth-module/issues/80)) ([2497cc0](https://github.com/nuxt-community/auth-module/commit/2497cc0))
- **docs:** add comma following \_scheme value ([#189](https://github.com/nuxt-community/auth-module/issues/189)) ([d993e01](https://github.com/nuxt-community/auth-module/commit/d993e01))

### Features

- add watchLoggedIn option to optionally disable it ([#80](https://github.com/nuxt-community/auth-module/issues/80)) ([16a7904](https://github.com/nuxt-community/auth-module/commit/16a7904))

<a name="4.4.0"></a>

# [4.4.0](https://github.com/nuxt-community/auth-module/compare/v4.3.0...v4.4.0) (2018-05-18)

### Bug Fixes

- **storage:** use false value for unsetting token/user ([#160](https://github.com/nuxt-community/auth-module/issues/160)) ([0450b57](https://github.com/nuxt-community/auth-module/commit/0450b57)), closes [nuxt-community/auth-module#133](https://github.com/nuxt-community/auth-module/issues/133)

### Features

- **oauth2:** set axios token ([#175](https://github.com/nuxt-community/auth-module/issues/175)) ([6206803](https://github.com/nuxt-community/auth-module/commit/6206803))

### Reverts

- revert [#158](https://github.com/nuxt-community/auth-module/issues/158) due to conflicts ([2afe9ca](https://github.com/nuxt-community/auth-module/commit/2afe9ca))

<a name="4.3.0"></a>

# [4.3.0](https://github.com/nuxt-community/auth-module/compare/v4.2.1...v4.3.0) (2018-04-28)

### Bug Fixes

- github provider ([#159](https://github.com/nuxt-community/auth-module/issues/159)) ([8b1819f](https://github.com/nuxt-community/auth-module/commit/8b1819f))

### Features

- laravel passport provider ([#157](https://github.com/nuxt-community/auth-module/issues/157)) ([9b09459](https://github.com/nuxt-community/auth-module/commit/9b09459))

<a name="4.2.1"></a>

## [4.2.1](https://github.com/nuxt-community/auth-module/compare/v4.2.0...v4.2.1) (2018-04-27)

### Bug Fixes

- storage cookie get on client side ([#153](https://github.com/nuxt-community/auth-module/issues/153)) ([8275e60](https://github.com/nuxt-community/auth-module/commit/8275e60))
- **watch loggedIn:** disable redirect on direct page loads ([#158](https://github.com/nuxt-community/auth-module/issues/158)) ([0386eb9](https://github.com/nuxt-community/auth-module/commit/0386eb9))

<a name="4.2.0"></a>

# [4.2.0](https://github.com/nuxt-community/auth-module/compare/v4.1.0...v4.2.0) (2018-04-20)

### Bug Fixes

- add check for req object on getCookie ([#132](https://github.com/nuxt-community/auth-module/issues/132)) ([7d17f75](https://github.com/nuxt-community/auth-module/commit/7d17f75))
- don't redirect callback to login when using 'auth' globally ([#131](https://github.com/nuxt-community/auth-module/issues/131)) ([08d86cb](https://github.com/nuxt-community/auth-module/commit/08d86cb))
- **docs:** update redirect in options.md ([#146](https://github.com/nuxt-community/auth-module/issues/146)) ([19de22b](https://github.com/nuxt-community/auth-module/commit/19de22b))
- fullPathRedirect with query support ([#149](https://github.com/nuxt-community/auth-module/issues/149)) ([a37d599](https://github.com/nuxt-community/auth-module/commit/a37d599))
- logout locally before logging in. fixes [#136](https://github.com/nuxt-community/auth-module/issues/136). ([#151](https://github.com/nuxt-community/auth-module/issues/151)) ([b6cfad4](https://github.com/nuxt-community/auth-module/commit/b6cfad4))

### Features

- **oauth2:** support authorization code grant and refresh token ([#145](https://github.com/nuxt-community/auth-module/issues/145)) ([18ecca5](https://github.com/nuxt-community/auth-module/commit/18ecca5))
- add support for custom token key in request header ([#152](https://github.com/nuxt-community/auth-module/issues/152)) ([f7576e3](https://github.com/nuxt-community/auth-module/commit/f7576e3))

<a name="4.1.0"></a>

# [4.1.0](https://github.com/nuxt-community/auth-module/compare/v4.0.1...v4.1.0) (2018-04-09)

### Features

- **scheme/oauth2:** add option to use IdToken instead of AccessToken ([#121](https://github.com/nuxt-community/auth-module/issues/121)) ([554a042](https://github.com/nuxt-community/auth-module/commit/554a042))
- add support for logging out without an API endpoint ([#124](https://github.com/nuxt-community/auth-module/issues/124)) ([6189c6d](https://github.com/nuxt-community/auth-module/commit/6189c6d))

<a name="4.0.1"></a>

## [4.0.1](https://github.com/nuxt-community/auth-module/compare/v4.0.0...v4.0.1) (2018-04-03)

### Bug Fixes

- **local-scheme-token:** avoid token type duplicata on Axios requests ([3908563](https://github.com/nuxt-community/auth-module/commit/3908563))
- **local-scheme-token:** removed token type from axios setToken ([c64e7f1](https://github.com/nuxt-community/auth-module/commit/c64e7f1)), closes [#113](https://github.com/nuxt-community/auth-module/issues/113)
- **scheme-resolution:** fix problem with backslashes in path to schemes on windows ([77161b8](https://github.com/nuxt-community/auth-module/commit/77161b8))
- no token exception when tokenRequired is set to false ([#118](https://github.com/nuxt-community/auth-module/issues/118)) ([56265a7](https://github.com/nuxt-community/auth-module/commit/56265a7))

<a name="4.0.0"></a>

# [4.0.0](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.3...v4.0.0) (2018-04-02)

### Bug Fixes

- clear axios token after logout ([#84](https://github.com/nuxt-community/auth-module/issues/84)) ([be65f09](https://github.com/nuxt-community/auth-module/commit/be65f09))
- Typo in README.md ([1ec0882](https://github.com/nuxt-community/auth-module/commit/1ec0882))
- use getToken ([bec8518](https://github.com/nuxt-community/auth-module/commit/bec8518))
- wrong axios ordering in windows platform. ([#56](https://github.com/nuxt-community/auth-module/issues/56)) ([44db0d4](https://github.com/nuxt-community/auth-module/commit/44db0d4))
- **auth:** return promise reject on request error ([f2883c6](https://github.com/nuxt-community/auth-module/commit/f2883c6))
- **fetchUser:** fetchUser should only be called when enabled ([dd0638e](https://github.com/nuxt-community/auth-module/commit/dd0638e))
- **fetchUser:** fetchUser should only be called when enabled ([#60](https://github.com/nuxt-community/auth-module/issues/60)) ([beb3121](https://github.com/nuxt-community/auth-module/commit/beb3121))
- **module:** remove duplicate strategy options ([2e167f8](https://github.com/nuxt-community/auth-module/commit/2e167f8))

### Features

- add auth0-js scheme ([c38a1e4](https://github.com/nuxt-community/auth-module/commit/c38a1e4))
- **package:** add client-oauth2 ([e0efa60](https://github.com/nuxt-community/auth-module/commit/e0efa60))
- **redirect:** add full path redirect option ([#96](https://github.com/nuxt-community/auth-module/issues/96)) ([ca8785f](https://github.com/nuxt-community/auth-module/commit/ca8785f))
- allow extending auth with plugins ([#98](https://github.com/nuxt-community/auth-module/issues/98)) ([3712a60](https://github.com/nuxt-community/auth-module/commit/3712a60))
- allow providers params to be overloaded from nuxt.config.js ([#77](https://github.com/nuxt-community/auth-module/issues/77)) ([8542959](https://github.com/nuxt-community/auth-module/commit/8542959))
- handle invalid strategy ([f079ae2](https://github.com/nuxt-community/auth-module/commit/f079ae2))
- loginWith function ([2aed448](https://github.com/nuxt-community/auth-module/commit/2aed448))
- **test:** add custom \_provider and \_scheme for basic fixture ([7423e77](https://github.com/nuxt-community/auth-module/commit/7423e77))
- use consola for cli messages ([1db2b2e](https://github.com/nuxt-community/auth-module/commit/1db2b2e))
- user and loggedIn shortcuts ([13a5eec](https://github.com/nuxt-community/auth-module/commit/13a5eec))

### Performance Improvements

- **module:** optimize plugin ([b7998c6](https://github.com/nuxt-community/auth-module/commit/b7998c6))

<a name="4.0.0-rc.3"></a>

# [4.0.0-rc.3](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.2...v4.0.0-rc.3) (2018-02-04)

### Bug Fixes

- fix scope checks during logout ([e2ebd97](https://github.com/nuxt-community/auth-module/commit/e2ebd97))

### Features

- refactor init logic to $auth.init and improve error handling ([b58ca17](https://github.com/nuxt-community/auth-module/commit/b58ca17))

<a name="4.0.0-rc.2"></a>

# [4.0.0-rc.2](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.1...v4.0.0-rc.2) (2018-02-03)

### Bug Fixes

- **Auth:** register vuex store before all watchers ([006650f](https://github.com/nuxt-community/auth-module/commit/006650f))

<a name="4.0.0-rc.1"></a>

# [4.0.0-rc.1](https://github.com/nuxt-community/auth-module/compare/v4.0.0-rc.0...v4.0.0-rc.1) (2018-02-03)

### Bug Fixes

- **deps:** update dependencies ([5d6cb8a](https://github.com/nuxt-community/auth-module/commit/5d6cb8a))
- **watcher:** close [#52](https://github.com/nuxt-community/auth-module/issues/52) and undefined bug ([2a03f2f](https://github.com/nuxt-community/auth-module/commit/2a03f2f))

### Features

- watchState and watchLoggedIn ([b628455](https://github.com/nuxt-community/auth-module/commit/b628455)), closes [#52](https://github.com/nuxt-community/auth-module/issues/52)

<a name="4.0.0-rc.0"></a>

# [4.0.0-rc.0](https://github.com/nuxt-community/auth-module/compare/v3.4.1...v4.0.0-rc.0) (2018-02-02)

### Bug Fixes

- guard check ([cf013a0](https://github.com/nuxt-community/auth-module/commit/cf013a0))
- prevent middleware infinite loops ([6ec1b34](https://github.com/nuxt-community/auth-module/commit/6ec1b34))
- ssr and code reduction ([952700c](https://github.com/nuxt-community/auth-module/commit/952700c))
- typo in lodash template ([eac33d2](https://github.com/nuxt-community/auth-module/commit/eac33d2))

### Features

- $auth.hasScope ([6d6c7b3](https://github.com/nuxt-community/auth-module/commit/6d6c7b3))
- $auth.onError ([151868a](https://github.com/nuxt-community/auth-module/commit/151868a))
- allow `token` to be a nested object in the response ([#45](https://github.com/nuxt-community/auth-module/issues/45)) ([8064839](https://github.com/nuxt-community/auth-module/commit/8064839))
- handle endpoints.propertyName ([710561b](https://github.com/nuxt-community/auth-module/commit/710561b)), closes [#46](https://github.com/nuxt-community/auth-module/issues/46)
- rewriteRedirects ([dde409a](https://github.com/nuxt-community/auth-module/commit/dde409a))
- update defaults to axios 5.x ([10157aa](https://github.com/nuxt-community/auth-module/commit/10157aa))
- use new Auth class ([d4da740](https://github.com/nuxt-community/auth-module/commit/d4da740))

### Performance Improvements

- improve cookie handling ([c50e68f](https://github.com/nuxt-community/auth-module/commit/c50e68f))

### BREAKING CHANGES

- Lot's of API and Usage changes

<a name="3.4.1"></a>

## [3.4.1](https://github.com/nuxt-community/auth-module/compare/v3.4.0...v3.4.1) (2017-12-29)

### Bug Fixes

- rc11 backward compatibility ([c0222e9](https://github.com/nuxt-community/auth-module/commit/c0222e9))

<a name="3.4.0"></a>

# [3.4.0](https://github.com/nuxt-community/auth-module/compare/v3.3.0...v3.4.0) (2017-12-29)

### Bug Fixes

- **store:** return promise in all actions ([1a9a76e](https://github.com/nuxt-community/auth-module/commit/1a9a76e))

### Features

- improve compatibility for nuxt 1.0.0 ([7740dec](https://github.com/nuxt-community/auth-module/commit/7740dec))

<a name="3.3.0"></a>

# [3.3.0](https://github.com/nuxt-community/auth-module/compare/v3.2.1...v3.3.0) (2017-12-28)

### Features

- add fetchUser option ([#27](https://github.com/nuxt-community/auth-module/issues/27)) ([1b8856c](https://github.com/nuxt-community/auth-module/commit/1b8856c))
- allow customizing http method for user endpoint ([#28](https://github.com/nuxt-community/auth-module/issues/28)) ([994152b](https://github.com/nuxt-community/auth-module/commit/994152b))
- more compatibility for nuxt@next ([d50be11](https://github.com/nuxt-community/auth-module/commit/d50be11))

<a name="3.2.1"></a>

## [3.2.1](https://github.com/nuxt-community/auth-module/compare/v3.2.0...v3.2.1) (2017-12-20)

<a name="3.2.0"></a>

# [3.2.0](https://github.com/nuxt-community/auth-module/compare/v3.1.1...v3.2.0) (2017-11-18)

### Bug Fixes

- **store:** skip only if token is not set. resolves [#20](https://github.com/nuxt-community/auth-module/issues/20). ([23b12d5](https://github.com/nuxt-community/auth-module/commit/23b12d5))

### Features

- **store:** resetOnFail option ([55e2397](https://github.com/nuxt-community/auth-module/commit/55e2397))

<a name="3.1.1"></a>

## [3.1.1](https://github.com/nuxt-community/auth-module/compare/v3.1.0...v3.1.1) (2017-11-17)

### Bug Fixes

- **store:** better check for loggedIn ([37f22fe](https://github.com/nuxt-community/auth-module/commit/37f22fe))

<a name="3.1.0"></a>

# [3.1.0](https://github.com/nuxt-community/auth-module/compare/v3.0.1...v3.1.0) (2017-11-15)

### Features

- **store:** let LocalStorage to be optional ([#18](https://github.com/nuxt-community/auth-module/issues/18), [@epartipilo](https://github.com/epartipilo)) ([b4086a0](https://github.com/nuxt-community/auth-module/commit/b4086a0))
- improve token options ([2a2c4c2](https://github.com/nuxt-community/auth-module/commit/2a2c4c2))

<a name="3.0.1"></a>

## [3.0.1](https://github.com/nuxt-community/auth-module/compare/v3.0.0...v3.0.1) (2017-11-12)

### Bug Fixes

- **middleware:** redirects ([77bd1e4](https://github.com/nuxt-community/auth-module/commit/77bd1e4))

<a name="3.0.0"></a>

# [3.0.0](https://github.com/nuxt-community/auth-module/compare/v2.0.7...v3.0.0) (2017-11-10)

### Features

- improve auth store ([499c28a](https://github.com/nuxt-community/auth-module/commit/499c28a))
- improvements ([#11](https://github.com/nuxt-community/auth-module/issues/11)) ([5d870c2](https://github.com/nuxt-community/auth-module/commit/5d870c2))

### Performance Improvements

- import only needed lodash functions ([#14](https://github.com/nuxt-community/auth-module/issues/14), [@leahci](https://github.com/leahci)Mic) ([fc6ae68](https://github.com/nuxt-community/auth-module/commit/fc6ae68))

### BREAKING CHANGES

- Some options changed and/or simplified

<a name="2.0.7"></a>

## [2.0.7](https://github.com/nuxt-community/auth-module/compare/v2.0.6...v2.0.7) (2017-10-19)

<a name="2.0.6"></a>

## [2.0.6](https://github.com/nuxt-community/auth-module/compare/v2.0.5...v2.0.6) (2017-10-19)

<a name="2.0.5"></a>

## [2.0.5](https://github.com/nuxt-community/auth-module/compare/v2.0.4...v2.0.5) (2017-09-06)

### Bug Fixes

- warn only needed ([a9dbe04](https://github.com/nuxt-community/auth-module/commit/a9dbe04))

<a name="2.0.4"></a>

## [2.0.4](https://github.com/nuxt-community/auth-module/compare/v2.0.3...v2.0.4) (2017-09-05)

### Bug Fixes

- warn when axios module is not registered ([6ace50b](https://github.com/nuxt-community/auth-module/commit/6ace50b))

<a name="2.0.3"></a>

## [2.0.3](https://github.com/nuxt-community/auth-module/compare/v2.0.2...v2.0.3) (2017-09-04)

### Bug Fixes

- **package:** publish templates ([eb1706a](https://github.com/nuxt-community/auth-module/commit/eb1706a))

<a name="2.0.2"></a>

## [2.0.2](https://github.com/nuxt-community/auth-module/compare/v2.0.1...v2.0.2) (2017-09-04)

<a name="2.0.1"></a>

## [2.0.1](https://github.com/nuxt-community/auth-module/compare/v0.0.1...v2.0.1) (2017-09-04)

<a name="0.0.1"></a>

## 0.0.1 (2017-09-04)
