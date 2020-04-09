import Token from './token';
// Type definitions for @nuxtjs/auth 4.8
// Project: https://auth.nuxtjs.org
// TypeScript Version: 3.1

export interface Storage {
  setUniversal(key: string, value: any, isJson?: boolean): string;
  getUniversal(key: string, isJson?: boolean): any;
  syncUniversal(key: string, defaultValue: any, isJson?: boolean): any;
  // Local State
  setState(key: string, val: any): string;
  getState(key: string): string;
  watchState(key: string, handler: (newValue: any) => void): any;
  // Cookies
  setCookie(key: string, val: any, options?: object): any;
  getCookie(key: string, isJson?: boolean): any;
  // Local Storage
  setLocalStorage(key: string, val: any, isJson?: boolean): any;
  getLocalStorage(key: string, isJson?: boolean): any;
}

export interface Auth<T = any> {
  ctx: any;
  $state: any;
  $storage: Storage;
  user: Partial<T>;
  loggedIn: boolean;
  loginWith(strategyName: string, ...args: any): Promise<never>;
  login(...args: any): Promise<never>;
  logout(): Promise<never>;
  fetchUser(): Promise<never>;
  fetchUserOnce(): Promise<never>;
  hasScope(scopeName: string): boolean;
  onError(handler: (error: Error, name: string, endpoint: any) => void): any;
  setUser(user?: Partial<T>): any;
  reset(): Promise<never>;
  redirect(name: string): any;
  onRedirect(listener: () => void): void;
  strategy(): string;
  registerStrategy(strategyName: string, strategy: object): void;
  setStrategy(strategyName: string): void;
  setUserToken(token: string): Promise<void>;
  refreshTokens(): Promise<any>;
  token: Token;
  refreshToken: Token;

}

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
