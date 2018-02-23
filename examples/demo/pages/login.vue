<template>
<div>
  <h2 class="text-center">Login</h2>
  <hr>
  <b-alert v-model="hasError" dismissible variant="danger">Please check credentials.</b-alert>
  <b-alert show v-if="redirect">
    You have to login before accessing to <strong>{{ redirect }}</strong>
  </b-alert>
  <b-row align-h="center" align-v="center">
    <b-col md="4">
      <b-card bg-variant="light">
        <form @keydown.enter="login">
        <b-form-group label="Username">
          <b-input v-model="username" placeholder="any username" ref="username" />
        </b-form-group>

        <b-form-group label="Password">
          <b-input type="password" v-model="password" placeholder="Use '123'" />
        </b-form-group>

        <div class="text-center">
          <b-btn @click="login" variant="primary" block>Login</b-btn>
        </div>
        </form>
      </b-card>
    </b-col>
    <b-col md="1">
      <div class="text-center"><b-badge pill>OR</b-badge></div>
    </b-col>
    <b-col md="4" class="text-center pt-4">
        <b-card title="Social Login" bg-variant="light">
          <div v-for="s in strategies" :key="s.key" class="mb-2">
          <b-btn @click="$auth.loginWith(s.key)" block :style="{background: s.color}" class="login-button">Login with {{ s.name }}</b-btn>
          </div>
        </b-card>
    </b-col>
  </b-row>
</div>
</template>

<style scoped>
.login-button {
  border: 0;
};
</style>

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
    strategies: () => ([
     { key: 'auth0', name: 'Auth0', color: '#ec5425' },
     { key: 'google', name: 'Google', color: '#4284f4' },
     { key: 'facebook', name: 'Facebook', color: '#3c65c4' },
    ]),
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    }
  },
  mounted() {
    this.$refs.username.focus()
  },
  methods: {
    async login() {
      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.hasError = true
        })
    }
  }
}
</script>
