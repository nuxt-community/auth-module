const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const jwt = require('jsonwebtoken')

const users = require( '../model/users')

/**
 * Refer to doc for facebook profile fields
 * @ref https://developers.facebook.com/docs/graph-api/reference/v2.12/user
 */
const facebook = {
  clientID: process.env.FACEBOOK_CLIENT_ID || '1671464192946675',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/social/facebook/callback',
  profileFields: ['id', 'first_name', 'last_name', 'location', 'gender', 'birthday', 'emails', 'relationship_status', 'friends', 'picture{url}']
}

const google = {
  clientID: process.env.GOOGLE_CLIENT_ID || '956748748298-kr2t08kdbjq3ke18m3vkl6k843mra1cg.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/social/google/callback'
}

const jwtSecret = 'dummy'

const callback = 'http://localhost:3000/callback'

const generateRandomId = () => Math.random().toString(36).substring(2, 15)

const generateUserToken = (username) => {
  return jwt.sign({
    username,
    picture: 'https://github.com/nuxt.png',
    name: 'User ' + username,
    scope: ['test', 'user']
  }, jwtSecret)
}

const sendUserToken = (req, res) => {
  const accessToken = generateUserToken(req.user.name)
  res.redirect(callback + '?access_token=' + accessToken)
}

const passport = (passport) => {

  // https://graph.facebook.com/v2.12/debug_token?input_token=
  passport.use(new FacebookStrategy(
    facebook, function (accessToken, refreshToken, json, profile, done) {
      let user = users.getUserByExternalId('facebook', profile.id)
      if (!user) {
        user = users.createUser(profile.emails[0].value, 'facebook', profile.id)
      }
      return done(null, user)
    }))

  passport.use(new GoogleStrategy(
    google, (accessToken, refreshToken, json, profile, done) => {
      let user = users.getUserByExternalId('google', profile.id)
      if (!user) {
        user = users.createUser(profile.emails[0].value, 'google', profile.id)
      }

      return done(null, user)
    }))
}

// export default passport
module.exports = {
  passport,
  facebook,
  google,
  jwtSecret,
  generateUserToken,
  sendUserToken,
  generateRandomId
}
