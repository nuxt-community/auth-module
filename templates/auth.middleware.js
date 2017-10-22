import middleware from './middleware'

const options = <%= serialize(options) %>

middleware.auth = function authMiddleware ({ store, redirect }) {
  // If user not logged in, redirect to /login
  if (!store.getters['auth/loggedIn']) {
    console.log(options)
    return redirect(options.notLoggedInRedirectTo)
  }
}

middleware['no-auth'] = function noAuthMiddleware ({ store, redirect }) {
  // If user is already logged in, redirect to /
  if (store.getters['auth/loggedIn']) {
    return redirect(options.loggedInRedirectTo)
  }
}
