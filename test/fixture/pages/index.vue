<template>
    <div>
    <h3>State:</h3>
    Token: {{ $auth.token || '-' }}
    <pre>{{ state }}</pre>
    <hr>
    <button @click="login('user', 'pass')">Login (Valid)</button>
    <button @click="login('foo', 'bar')">Login (Invalid)</button>
    <button @click="$auth.fetchUser()">Fetch User</button>
    <button @click="$auth.logout()">Logout</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errors: []
    }
  },
  created() {
    this.$auth.hook('error', (err => {
      console.error(err)
      this.errors.push(err)
    }))
  },
  computed: {
    state() {
      return JSON.stringify(this.$auth.state, undefined, 2)
    }
  },
  methods: {
    login(username, password) {
      return this.$auth.login({ data: { username, password }})
    }
  }
}
</script>
