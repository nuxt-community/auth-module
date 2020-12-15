<template>
  <div>
    <b-navbar toggleable="md" variant="light">
      <b-navbar-toggle target="nav_collapse" />
      <b-navbar-brand to="/"> Nuxt.js </b-navbar-brand>

      <b-collapse id="nav_collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" exact> Home </b-nav-item>
          <b-nav-item to="/public"> Public </b-nav-item>
          <b-nav-item to="/secure"> Secure </b-nav-item>
          <b-nav-item to="/oauth2RefreshTest">
            Oauth2 token refresh test
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <template v-if="$auth.$state.loggedIn">
            <b-nav-item-dropdown :text="$auth.user.name" right>
              <b-dropdown-item @click="$auth.logout()">
                Logout
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-img
              :src="picture"
              class="mt-1"
              rounded="circle"
              width="30px"
              height="30px"
            />
          </template>
          <template v-else>
            <b-dropdown-item to="/login"> Login </b-dropdown-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container class="mt-4">
      <nuxt />
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import get from 'lodash.get'

export default Vue.extend({
  computed: {
    picture() {
      return (
        get(this.$auth.user, 'picture') || // OpenID
        get(this.$auth.user, 'picture.data.url') || // Facebook graph API
        get(this.$auth.user, 'avatar_url')
      ) // GitHub
    }
  }
})
</script>
