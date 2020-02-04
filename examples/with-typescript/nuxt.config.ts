import { Configuration } from "@nuxt/types";
import { resolve } from "path";

const config: Configuration = {
  server: {
    host: "0.0.0.0"
  },
  srcDir: __dirname,
  buildDir: resolve(__dirname, ".nuxt"),
  dev: false,
  render: {
    resourceHints: false
  },
  serverMiddleware: ["../api/auth"],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { propertyName: "token.accessToken" }
        }
      }
    }
  },
  buildModules: ["@nuxt/typescript-build"],
  modules: [
    "bootstrap-vue/nuxt", // https://bootstrap-vue.js.org/docs/#nuxt-js
    "@nuxtjs/axios",
    "@nuxtjs/auth",
    "@nuxtjs/toast",
  ],
  axios: {
    proxy: true
  },
  proxy: {
    "/api": "http://localhost:3000"
  }
};

export default config;
