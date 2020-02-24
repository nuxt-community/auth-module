<template>
  <div>
    <div v-if="!isLoggedInWithOauth2">
      <b-alert show variant="info">You need to login with oauth2 if you want to test this feature.</b-alert>
    </div>
    <div v-else>
      <h3>Oauth2 token refresh tester</h3>
      Here you can test the automatic token refresh handling. You can read more about how it works in the docs.
      <hr>
      <div>
        <p>Open the network tab and click "Send requests". Notice the two requests that are sent to our mock API
          "cats".</p>
        <p>
          Click "Invalidate token", and resend the requests. Notice the token request sent just before the two requests.
          Nuxt auth detected the token was expired, and refreshed it before sending the requests.
        </p>
        <p>
          Click "Invalidate token and refresh token", and resend the requests. This time, the token cannot be refreshed,
          as even the refresh token is expired. Nuxt auth throws "ExpiredAuthSessionError" and logs the user out.
        </p>
      </div>
      <br>
      <b-btn-group>
        <b-btn variant="info" @click="sendRequests">Send requests</b-btn>
        <b-btn class="ml-4" variant="info" @click="invalidateToken">Invalidate token</b-btn>
        <b-btn class="ml-4" variant="info" @click="invalidateBothTokens">Invalidate token and refresh token</b-btn>
      </b-btn-group>
      <br>
      <br>

      <b-col md="12">
        <b-card title="Current token expiration dates">
          Token: {{ tokenExpiresAt }}
          <br/>
          Refresh token: {{ refreshTokenExpiresAt }}
        </b-card>
      </b-col>

      <hr>
    </div>
    <b-btn-group>
      <b-button @click="$auth.logout()">Logout</b-button>
    </b-btn-group>
  </div>
  </template>

  <script>
  import jwtDecode from 'jwt-decode'

  export default {
    middleware: ['auth'],
    data() {
      return {
        expiredToken: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjAsImV' +
          '4cCI6MCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.yTVE73E1wRUdtCEkHXZxc3' +
          'CJUFIV-_qfoSF0fI9QgmM',
        tokenExpiresAt: null,
        refreshTokenExpiresAt: null
      }
    },
    created() {
      this.updateDisplayedTokens()
    },
    computed: {
      isLoggedInWithOauth2() {
        return this.$auth.$state.strategy === 'oauth2mock' && this.$auth.$state.loggedIn
      }
    },
    methods: {
      invalidateToken() {
        this.$auth.setToken('oauth2mock', this.expiredToken)
        this.$auth.ctx.app.$axios.setHeader('Authorization', this.expiredToken)
        this.updateDisplayedTokens()
      },
      invalidateBothTokens() {
        this.invalidateToken()

        this.$auth.setRefreshToken('oauth2mock', this.expiredToken)
        this.updateDisplayedTokens()
      },
      async sendRequests() {
        try {
          const requests = []
          for (let i = 1; i < 3; i++) {
            const request = this.$auth.ctx.$axios.get('http://localhost:3000/oauth2mockserver/cats')
            requests.push(request)
          }
          await Promise.all(requests)
          this.updateDisplayedTokens()
        } catch (e) {
          if (e.name === 'ExpiredAuthSessionError') {
            console.log('Caught ExpiredAuthSessionError. This is ok. Sessions can expire.')
          } else throw e
        }
      },
      updateDisplayedTokens() {
        this.tokenExpiresAt = this.getTokenExpirationDateString(this.$auth.getToken('oauth2mock'))
        this.refreshTokenExpiresAt = this.getTokenExpirationDateString(this.$auth.getRefreshToken('oauth2mock'))
      },
      getTokenExpirationDateString(token) {
        try {
          return new Date(jwtDecode(token).exp * 1000).toDateString()
        } catch (e) {
          return '-'
        }
      }
    }
  }
  </script>
