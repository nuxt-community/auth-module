<template>
<div>
  <h2 class="text-center">Login</h2>
  <hr>
  <b-alert v-if="error" show variant="danger">{{ error + '' }}</b-alert>
  <b-alert show v-if="$auth.$state.redirect">
    You have to login before accessing to <strong>{{ $auth.$state.redirect }}</strong>
  </b-alert>
  <b-row align-h="center" align-v="center">
    <b-col md="4">
      <b-card bg-variant="light">
        <busy-overlay />
        <form @keydown.enter="login">
        <b-form-group label="Username">
          <b-input v-model="username" placeholder="anything" ref="username" />
        </b-form-group>

        <b-form-group label="Password">
          <b-input type="password" v-model="password" placeholder="123" />
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
import busyOverlay from '~/components/busy-overlay'

export default {
  middleware: ['auth'],
  components: { busyOverlay },
  data() {
    return {
      username: '',
      password: '123',
      error: null
    }
  },
  computed: {
    strategies: () => ([
     { key: 'auth0', name: 'Auth0', color: '#ec5425' },
     { key: 'google', name: 'Google', color: '#4284f4' },
     { key: 'facebook', name: 'Facebook', color: '#3c65c4' },
     { key: 'github', name: 'GitHub', color: '#202326' }
    ]),
    redirect() {
      return (
        this.$route.query.redirect &&
        decodeURIComponent(this.$route.query.redirect)
      )
    },
    isCallback() {
      return Boolean(this.$route.query.callback)
    }
  },
  methods: {
    async login() {
      this.error = null

      return this.$auth
        .loginWith('local', {
          data: {
            username: this.username,
            password: this.password
          }
        })
        .catch(e => {
          this.error = e + ''
        })
    }
  }
}
</script>
