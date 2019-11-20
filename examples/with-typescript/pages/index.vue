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

<script lang="ts">
// While you are using nuxt-class-component you should always
// import Vue and its class decorator Component
import Vue from "vue";
import Component from "nuxt-class-component";
import AuthMixin from "~/mixins/auth";

// Utilize declaration merging to type the Default class with the mixin types
export interface Default extends AuthMixin {}

@Component({
  mixins: [AuthMixin]
})
export class Index extends Vue {
  /**
   * Computed string returning login status depending on current
   * authentication state from auth-module.
   *
   * @returns {string}
   */
  get loggedInStatus() {
    return this.$auth.$state.loggedIn ? "Logged In" : "Guest";
  }
}

// Can't declaration merge a default export, so export it seperately
export default Index;
</script>
