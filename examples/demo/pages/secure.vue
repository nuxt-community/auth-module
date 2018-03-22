<template>
    <div>
    <b-alert show variant="warning">This is a secure page!</b-alert>
    <b-row>
      <b-col md="8">
        <b-card title="State">
          <pre>{{ state }}</pre>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-card title="Scopes" class="mb-2">
          User: <b-badge>{{ $auth.hasScope('user') }}</b-badge>
          Test: <b-badge>{{ $auth.hasScope('test') }}</b-badge>
          Admin: <b-badge>{{ $auth.hasScope('admin') }}</b-badge>
        </b-card>
        <b-card title="token">
          {{ $auth.token || '-' }}
        </b-card>
      </b-col>
    </b-row>
    <hr>
    <b-btn-group>
      <b-button @click="$auth.fetchUser()">Fetch User</b-button>
      <b-button @click="$auth.logout()">Logout</b-button>
    </b-btn-group>
  </div>
</template>

<script>
export default {
  middleware: ['auth'],
  computed: {
    state() {
      return JSON.stringify(this.$auth.$state, undefined, 2)
    }
  }
}
</script>
