<template>
  <div>
    <b-jumbotron class="text-center">
      <h3>Welcome to Nuxt.js auth example</h3>
      <div class="mt-1">
        <template v-if="$auth.$state.loggedIn">
          <b-btn class="ml-3" variant="info" to="/secure">Secure</b-btn>
          <b-btn class="ml-3" variant="danger" @click="this.logout">Logout</b-btn>
        </template>
        <b-btn variant="success" v-else to="/login">Login</b-btn>
      </div>
    </b-jumbotron>

    <div>
      User status:
      <b-badge>{{ this.loggedInStatus }}</b-badge>
    </div>
  </div>
</template>

<script>
// While you are using nuxt-class-component you should always
// import Vue and its class decorator Component
import Vue from 'vue'
import Component from 'nuxt-class-component'
import AuthMixin from '~/mixins/auth'

@Component({
  mixins: [AuthMixin]
})
export default class Index extends Vue {

  /**
   * Computed string returning login status depending on current
   * authentication state from auth-module.
   *
   * @returns {string}
   */
  get loggedInStatus () {
    return this.$auth.$state.loggedIn ? 'Logged In' : 'Guest'
  }
}
</script>
