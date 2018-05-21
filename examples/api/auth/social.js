const passport = require('passport')
const router = require('express').Router()

const config = require('./config')

router.get('/facebook',
  passport.authenticate('facebook', { session: false, scope: ['public_profile', 'email', 'user_friends', 'user_birthday'] }))
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  config.sendUserToken)

// Refresh token only comes on the first authentication
// It can be obtained again, by reprompting consent from the user with prompt: 'consent', accessType: 'offline'
router.get('/google',
  passport.authenticate('google', { session: false, accessType: 'offline', scope: ['openid', 'profile', 'email'] }))
router.get('/google/callback',
  passport.authenticate('google', { session: false, accessType: 'offline'}),
  config.sendUserToken)

module.exports = router
