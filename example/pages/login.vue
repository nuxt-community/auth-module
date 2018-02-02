<template>
<div>
  <h2>Login</h2>
  <hr>
  <b-alert v-model="hasError" dismissible variant="danger">Please check credentials.</b-alert>
  <b-alert show v-if="redirect">
    You have to login before accessing to <strong>{{ redirect }}</strong>
  </b-alert>
  <form @keydown.enter="login">
    <b-form-group label="Username">
      <b-input v-model="username" placeholder="Use any username" ref="username" />
    </b-form-group>

    <b-form-group label="Password">
      <b-input type="password" v-model="password" placeholder="Use '123'" />
    </b-form-group>

    <div class="text-center">
      <b-btn @click="login" variant="outline-primary" size="lg">Login</b-btn>
    </div>
  </form>
</div>
</template>

<script>
export default {
  middleware: ['auth'],
  data() {
    return {
      username: '',
      password: '123',
      hasError: false
    }
  },
  computed: {
    redirect() {
      return this.$route.query.redirect && decodeURIComponent(this.$route.query.redirect)
    }
  },
  mounted() {
    this.$refs.username.focus()
  },
  methods: {
    async login() {
      return this.$auth.login({
        data: {
          username: this.username,
          password: this.password
        }
      }).catch(e => {
        this.hasError = true
      })
    }
  }
}
</script>
