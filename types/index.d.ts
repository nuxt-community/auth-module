
export * from "./auth";
export * from "./refreshController";
export * from "./requestHandler";
export * from "./storage";
export * from "./token";

declare module '@nuxt/types' {
  interface Context {
    $auth: Auth;
  }
  interface NuxtAppOptions {
    $auth: Auth;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    auth?: true | false | 'guest';
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $auth: any;
  }
}
