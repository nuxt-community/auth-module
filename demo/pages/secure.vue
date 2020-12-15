<template>
  <div>
    <b-alert show variant="warning"> This is a secure page! </b-alert>
    <b-row>
      <b-col md="8">
        <b-card title="State">
          <pre>{{ state }}</pre>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="Scopes" class="mb-2">
          User: <b-badge>{{ $auth.hasScope('user') }}</b-badge> Test:
          <b-badge>{{ $auth.hasScope('test') }}</b-badge> Admin:
          <b-badge>{{ $auth.hasScope('admin') }}</b-badge>
        </b-card>
        <b-card v-if="$auth.strategy.token" title="token" class="mb-2">
          <div style="white-space: nowrap; overflow: auto">
            {{ $auth.strategy.token.get() || '-' }}
          </div>
        </b-card>
        <b-card v-if="$auth.strategy.refreshToken" title="refresh token">
          <div style="white-space: nowrap; overflow: auto">
            {{ $auth.strategy.refreshToken.get() || '-' }}
          </div>
        </b-card>
      </b-col>
    </b-row>
    <hr />
    <b-btn-group>
      <b-button @click="$auth.fetchUser()"> Fetch User </b-button>
      <b-button @click="refreshTokens"> Refresh Tokens </b-button>
      <b-button @click="$auth.logout()"> Logout </b-button>
    </b-btn-group>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  middleware: ['auth'],
  computed: {
    state() {
      return JSON.stringify(this.$auth.$state, undefined, 2)
    }
  },
  methods: {
    refreshTokens() {
      this.$auth.refreshTokens().catch((e) => {
        this.error = e + ''
      })
    }
  }
})
</script>
