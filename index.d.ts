import 'vue'
import '@nuxt/types'
import type { ModuleOptions, RecursivePartial, Auth } from './dist/index'

export * from './dist/index'

declare module '@nuxt/types' {
  interface Context {
    $auth: Auth
  }
  interface NuxtAppOptions {
    $auth: Auth
  }

  interface Configuration {
    auth?: RecursivePartial<ModuleOptions>
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface ComponentOptions<V> {
    auth?: true | false | 'guest'
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $auth: Auth
  }
}
