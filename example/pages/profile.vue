<template>
    <div>
    <b-row>
      <b-col md="8">
        <b-card title="State">
          <pre>{{ state }}</pre>
        </b-card>
      </b-col>
      <b-col md="4">
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
      return JSON.stringify(this.$auth.state, undefined, 2)
    }
  }
}
</script>
