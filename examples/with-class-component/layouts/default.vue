<template>
  <div>
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/">Nuxt.js</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/" exact>Home</b-nav-item>
          <b-nav-item to="/public">Public</b-nav-item>
          <b-nav-item to="/secure">Secure</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <template v-if="$auth.$state.loggedIn">
            <b-nav-item-dropdown :text="$auth.$state.user.username" right>
              <b-dropdown-item @click="this.logout">Logout</b-dropdown-item>
            </b-nav-item-dropdown>
          </template>
          <template v-else>
            <b-dropdown-item to="/login">Login</b-dropdown-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container class="mt-4">
      <nuxt />
    </b-container>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'nuxt-class-component'
import AuthMixin from '~/mixins/auth'

@Component({
  mixins: [AuthMixin]
})
export default class Default extends Vue {

}
</script>
