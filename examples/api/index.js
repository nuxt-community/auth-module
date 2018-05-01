const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const expressJwt = require('express-jwt')
const passport = require('passport')

const auth = require('./auth')
const users = require('./model/users').userDB

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// Set up passport auth config
app.use(passport.initialize())
auth.config.passport(passport)

// JWT middleware
app.use(
  expressJwt({
    secret: auth.config.jwtSecret
  }).unless({
    path: [
      /\/api\/auth\/social\/*/,
      '/api/auth/login',
      '/api/users' // Testing purpose
    ]
  })
)

// -- Routes --
app.use('/auth', auth.router)

// [GET] get all users for testing purpose only
app.get('/users', (req, res) => {
  res.send(users)
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api',
  handler: app
}
