<template>
  <div>
    <h2 class="text-center">
      This page resembles the oauth2 server's login page
    </h2>
    <p>This is the authorization_endpoint specified in the options.</p>
    <p>When you click "login", you will be redirected to the callback page with an authorization code set as query param.</p>
    <p>Nuxt auth will then send the code back to the oauth2 server in order to receive a token and a refresh token.</p>
    <hr>
    <b-form-group label="Username">
      <b-input placeholder="anything" />
    </b-form-group>
    <b-form-group label="Password">
      <b-input type="password" placeholder="anything" />
    </b-form-group>
    <b-btn @click="login">
      Login
    </b-btn>
  </div>
</template>

<script>

export default {
  methods: {
    login () {
      const hash = this.parseQuery(this.$auth.ctx.route.hash.substr(1))
      const parsedQuery = Object.assign({}, this.$auth.ctx.route.query, hash)

      window.location.assign(`callback?code=123&state=${parsedQuery.state}`)
    },
    parseQuery (queryString) {
      const query = {}
      const pairs = queryString.split('&')
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split('=')
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
      }
      return query
    }
  }
}
</script>
