import Vue from 'vue'
import Auth from 'src/core/auth'
import { ModuleOptions } from './module'
import { RecursivePartial } from './utils'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ComponentOptions<V extends Vue> {
    auth?: true | false | 'guest'
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $auth: Auth
  }
}
