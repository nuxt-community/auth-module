<template>
  <div>
    <b-jumbotron class="text-center">
      <h3>Welcome to Nuxt.js auth example</h3>
      This demo is using auth-module v{{ version }}
      <div class="mt-1">
        <template v-if="$auth.$state.loggedIn">
          <b-btn class="ml-3" variant="info" to="/secure"> Secure </b-btn>
          <b-btn class="ml-3" variant="danger" @click="$auth.logout()">
            Logout
          </b-btn>
        </template>
        <b-btn v-else variant="success" to="/login"> Login </b-btn>
      </div>
    </b-jumbotron>

    <div>
      User status:
      <b-badge>{{ $auth.$state.loggedIn ? 'Logged In' : 'Guest' }}</b-badge>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { version } from '../../package.json'

export default Vue.extend({
  computed: {
    version: () => version
  }
})
</script>
