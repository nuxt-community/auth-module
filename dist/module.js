'use strict';

const path = require('path');
const defu = require('defu');
const fs = require('fs');
const hash = require('hasha');
const qs = require('querystring');
const axios = require('axios');
const bodyParser = require('body-parser');
const requrl = require('requrl');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const defu__default = /*#__PURE__*/_interopDefaultLegacy(defu);
const hash__default = /*#__PURE__*/_interopDefaultLegacy(hash);
const qs__default = /*#__PURE__*/_interopDefaultLegacy(qs);
const axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
const bodyParser__default = /*#__PURE__*/_interopDefaultLegacy(bodyParser);
const requrl__default = /*#__PURE__*/_interopDefaultLegacy(requrl);

const moduleDefaults = {
  resetOnError: false,
  ignoreExceptions: false,
  scopeKey: "scope",
  rewriteRedirects: true,
  fullPathRedirect: false,
  watchLoggedIn: true,
  redirect: {
    login: "/login",
    logout: "/",
    home: "/",
    callback: "/login"
  },
  vuex: {
    namespace: "auth"
  },
  cookie: {
    prefix: "auth.",
    options: {
      path: "/"
    }
  },
  localStorage: {
    prefix: "auth."
  },
  defaultStrategy: void 0,
  strategies: {}
};

function assignDefaults(strategy, defaults) {
  Object.assign(strategy, defu__default["default"](strategy, defaults));
}
function addAuthorize(nuxt, strategy, useForms = false) {
  const clientSecret = strategy.clientSecret;
  const clientID = strategy.clientId;
  const tokenEndpoint = strategy.endpoints.token;
  const audience = strategy.audience;
  delete strategy.clientSecret;
  const endpoint = `/_auth/oauth/${strategy.name}/authorize`;
  strategy.endpoints.token = endpoint;
  strategy.responseType = "code";
  const formMiddleware = bodyParser__default["default"].urlencoded({ extended: true });
  nuxt.options.serverMiddleware.unshift({
    path: endpoint,
    handler: (req, res, next) => {
      if (req.method !== "POST") {
        return next();
      }
      formMiddleware(req, res, () => {
        const {
          code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri = strategy.redirectUri,
          response_type: responseType = strategy.responseType,
          grant_type: grantType = strategy.grantType,
          refresh_token: refreshToken
        } = req.body;
        if (grantType === "authorization_code" && !code) {
          return next();
        }
        if (grantType === "refresh_token" && !refreshToken) {
          return next();
        }
        let data = {
          client_id: clientID,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: grantType,
          response_type: responseType,
          redirect_uri: redirectUri,
          audience,
          code_verifier: codeVerifier,
          code
        };
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json"
        };
        if (useForms) {
          data = qs__default["default"].stringify(data);
          headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        axios__default["default"].request({
          method: "post",
          url: tokenEndpoint,
          data,
          headers
        }).then((response) => {
          res.end(JSON.stringify(response.data));
        }).catch((error) => {
          res.statusCode = error.response.status;
          res.end(JSON.stringify(error.response.data));
        });
      });
    }
  });
}
function initializePasswordGrantFlow(nuxt, strategy) {
  const clientSecret = strategy.clientSecret;
  const clientId = strategy.clientId;
  const tokenEndpoint = strategy.endpoints.token;
  delete strategy.clientSecret;
  const endpoint = `/_auth/${strategy.name}/token`;
  strategy.endpoints.login.url = endpoint;
  strategy.endpoints.refresh.url = endpoint;
  const formMiddleware = bodyParser__default["default"].json();
  nuxt.options.serverMiddleware.unshift({
    path: endpoint,
    handler: (req, res, next) => {
      if (req.method !== "POST") {
        return next();
      }
      formMiddleware(req, res, () => {
        const data = req.body;
        if (!data.grant_type) {
          data.grant_type = strategy.grantType;
        }
        if (!data.client_id) {
          data.grant_type = clientId;
        }
        if (data.grant_type === "password" && (!data.username || !data.password)) {
          return next(new Error("Invalid username or password"));
        }
        if (data.grant_type === "refresh_token" && !data.refresh_token) {
          return next(new Error("Refresh token not provided"));
        }
        axios__default["default"].request({
          method: "post",
          url: tokenEndpoint,
          baseURL: requrl__default["default"](req),
          data: {
            client_id: clientId,
            client_secret: clientSecret,
            ...data
          },
          headers: {
            Accept: "application/json"
          }
        }).then((response) => {
          res.end(JSON.stringify(response.data));
        }).catch((error) => {
          res.statusCode = error.response.status;
          res.end(JSON.stringify(error.response.data));
        });
      });
    }
  });
}
function assignAbsoluteEndpoints(strategy) {
  const { url, endpoints } = strategy;
  if (endpoints) {
    for (const key of Object.keys(endpoints)) {
      const endpoint = endpoints[key];
      if (endpoint) {
        if (typeof endpoint === "object") {
          if (!endpoint.url || endpoint.url.startsWith(url)) {
            continue;
          }
          endpoints[key].url = url + endpoint.url;
        } else {
          if (endpoint.startsWith(url)) {
            continue;
          }
          endpoints[key] = url + endpoint;
        }
      }
    }
  }
}

function auth0(_nuxt, strategy) {
  const DEFAULTS = {
    scheme: "auth0",
    endpoints: {
      authorization: `https://${strategy.domain}/authorize`,
      userInfo: `https://${strategy.domain}/userinfo`,
      token: `https://${strategy.domain}/oauth/token`,
      logout: `https://${strategy.domain}/v2/logout`
    },
    scope: ["openid", "profile", "email"]
  };
  assignDefaults(strategy, DEFAULTS);
}

function discord(nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: "https://discord.com/api/oauth2/authorize",
      token: "https://discord.com/api/oauth2/token",
      userInfo: "https://discord.com/api/users/@me"
    },
    grantType: "authorization_code",
    codeChallengeMethod: "S256",
    scope: ["identify", "email"]
  };
  assignDefaults(strategy, DEFAULTS);
  addAuthorize(nuxt, strategy, true);
}

function facebook(_nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: "https://facebook.com/v2.12/dialog/oauth",
      userInfo: "https://graph.facebook.com/v2.12/me?fields=about,name,picture{url},email"
    },
    scope: ["public_profile", "email"]
  };
  assignDefaults(strategy, DEFAULTS);
}

function github(nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: "https://github.com/login/oauth/authorize",
      token: "https://github.com/login/oauth/access_token",
      userInfo: "https://api.github.com/user"
    },
    scope: ["user", "email"]
  };
  assignDefaults(strategy, DEFAULTS);
  addAuthorize(nuxt, strategy);
}

function google(_nuxt, strategy) {
  const DEFAULTS = {
    scheme: "oauth2",
    endpoints: {
      authorization: "https://accounts.google.com/o/oauth2/auth",
      userInfo: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    scope: ["openid", "profile", "email"]
  };
  assignDefaults(strategy, DEFAULTS);
}

function laravelJWT(_nuxt, strategy) {
  const { url } = strategy;
  if (!url) {
    throw new Error("url is required for laravel jwt!");
  }
  const DEFAULTS = {
    name: "laravelJWT",
    scheme: "laravelJWT",
    endpoints: {
      login: {
        url: url + "/api/auth/login"
      },
      refresh: {
        url: url + "/api/auth/refresh"
      },
      logout: {
        url: url + "/api/auth/logout"
      },
      user: {
        url: url + "/api/auth/user"
      }
    },
    token: {
      property: "access_token",
      maxAge: 3600
    },
    refreshToken: {
      property: false,
      data: false,
      maxAge: 1209600,
      required: false,
      tokenRequired: true
    },
    user: {
      property: false
    },
    clientId: false,
    grantType: false
  };
  assignDefaults(strategy, DEFAULTS);
  assignAbsoluteEndpoints(strategy);
}

function isPasswordGrant(strategy) {
  return strategy.grantType === "password";
}
function laravelPassport(nuxt, strategy) {
  const { url } = strategy;
  if (!url) {
    throw new Error("url is required is laravel passport!");
  }
  const defaults = {
    name: "laravelPassport",
    token: {
      property: "access_token",
      type: "Bearer",
      name: "Authorization",
      maxAge: 60 * 60 * 24 * 365
    },
    refreshToken: {
      property: "refresh_token",
      data: "refresh_token",
      maxAge: 60 * 60 * 24 * 30
    },
    user: {
      property: false
    }
  };
  if (isPasswordGrant(strategy)) {
    const _DEFAULTS = {
      ...defaults,
      scheme: "refresh",
      endpoints: {
        token: url + "/oauth/token",
        login: {
          baseURL: ""
        },
        refresh: {
          baseURL: ""
        },
        logout: false,
        user: {
          url: url + "/api/auth/user"
        }
      },
      grantType: "password"
    };
    assignDefaults(strategy, _DEFAULTS);
    assignAbsoluteEndpoints(strategy);
    initializePasswordGrantFlow(nuxt, strategy);
  } else {
    const _DEFAULTS = {
      ...defaults,
      scheme: "oauth2",
      endpoints: {
        authorization: url + "/oauth/authorize",
        token: url + "/oauth/token",
        userInfo: url + "/api/auth/user",
        logout: false
      },
      responseType: "code",
      grantType: "authorization_code",
      scope: "*"
    };
    assignDefaults(strategy, _DEFAULTS);
    assignAbsoluteEndpoints(strategy);
    addAuthorize(nuxt, strategy);
  }
}

function laravelSanctum(_nuxt, strategy) {
  const { url } = strategy;
  if (!url) {
    throw new Error("URL is required with Laravel Sanctum!");
  }
  const endpointDefaults = {
    withCredentials: true,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  };
  const DEFAULTS = {
    scheme: "cookie",
    name: "laravelSanctum",
    cookie: {
      name: "XSRF-TOKEN"
    },
    endpoints: {
      csrf: {
        ...endpointDefaults,
        url: url + "/sanctum/csrf-cookie"
      },
      login: {
        ...endpointDefaults,
        url: url + "/login"
      },
      logout: {
        ...endpointDefaults,
        url: url + "/logout"
      },
      user: {
        ...endpointDefaults,
        url: url + "/api/user"
      }
    },
    user: {
      property: false
    }
  };
  assignDefaults(strategy, DEFAULTS);
  assignAbsoluteEndpoints(strategy);
}

const ProviderAliases = {
  "laravel/jwt": "laravelJWT",
  "laravel/passport": "laravelPassport",
  "laravel/sanctum": "laravelSanctum"
};

const AUTH_PROVIDERS = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ProviderAliases: ProviderAliases,
  auth0: auth0,
  discord: discord,
  facebook: facebook,
  github: github,
  google: google,
  laravelJWT: laravelJWT,
  laravelPassport: laravelPassport,
  laravelSanctum: laravelSanctum
});

const BuiltinSchemes = {
  local: "LocalScheme",
  cookie: "CookieScheme",
  oauth2: "Oauth2Scheme",
  openIDConnect: "OpenIDConnectScheme",
  refresh: "RefreshScheme",
  laravelJWT: "LaravelJWTScheme",
  auth0: "Auth0Scheme"
};
function resolveStrategies(nuxt, options) {
  const strategies = [];
  const strategyScheme = {};
  for (const name of Object.keys(options.strategies)) {
    if (!options.strategies[name] || options.strategies[name].enabled === false) {
      continue;
    }
    const strategy = Object.assign({}, options.strategies[name]);
    if (!strategy.name) {
      strategy.name = name;
    }
    if (!strategy.provider) {
      strategy.provider = strategy.name;
    }
    const provider = resolveProvider(nuxt, strategy.provider);
    delete strategy.provider;
    if (typeof provider === "function") {
      provider(nuxt, strategy);
    }
    if (!strategy.scheme) {
      strategy.scheme = strategy.name;
    }
    const schemeImport = resolveScheme(nuxt, strategy.scheme);
    delete strategy.scheme;
    strategyScheme[strategy.name] = schemeImport;
    strategies.push(strategy);
  }
  return {
    strategies,
    strategyScheme
  };
}
function resolveScheme(nuxt, scheme) {
  if (typeof scheme !== "string") {
    return;
  }
  if (BuiltinSchemes[scheme]) {
    return {
      name: BuiltinSchemes[scheme],
      as: BuiltinSchemes[scheme],
      from: "~auth/runtime"
    };
  }
  const path = nuxt.resolvePath(scheme);
  if (fs.existsSync(path)) {
    const _path = path.replace(/\\/g, "/");
    return {
      name: "default",
      as: "Scheme$" + hash__default["default"](_path).substr(0, 4),
      from: _path
    };
  }
}
function resolveProvider(nuxt, provider) {
  if (typeof provider === "function") {
    return provider;
  }
  if (typeof provider !== "string") {
    return;
  }
  provider = ProviderAliases[provider] || provider;
  if (AUTH_PROVIDERS[provider]) {
    return AUTH_PROVIDERS[provider];
  }
  try {
    const m = nuxt.resolver.requireModule(provider, { useESM: true });
    return m.default || m;
  } catch (e) {
  }
}

const authModule = function(moduleOptions) {
  const options = defu__default["default"](moduleOptions, this.options.auth, moduleDefaults);
  const { strategies, strategyScheme } = resolveStrategies(this.nuxt, options);
  delete options.strategies;
  const _uniqueImports = new Set();
  const schemeImports = Object.values(strategyScheme).filter((i) => {
    if (_uniqueImports.has(i.as))
      return false;
    _uniqueImports.add(i.as);
    return true;
  });
  options.defaultStrategy = options.defaultStrategy || strategies.length ? strategies[0].name : "";
  const { dst } = this.addTemplate({
    src: path.resolve(__dirname, "../templates/plugin.js"),
    fileName: path.join("auth.js"),
    options: {
      options,
      strategies,
      strategyScheme,
      schemeImports
    }
  });
  this.options.plugins.push(path.resolve(this.options.buildDir, dst));
  if (options.plugins) {
    options.plugins.forEach((p) => this.options.plugins.push(p));
    delete options.plugins;
  }
  const runtime = path.resolve(__dirname, "runtime");
  this.options.alias["~auth/runtime"] = runtime;
  this.options.build.transpile.push(__dirname);
  this.options.build.transpile.push(/^nanoid/);
};

module.exports = authModule;
