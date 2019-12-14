const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jsonwebtoken = require('jsonwebtoken')

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// -- Routes --

// [POST] /login
app.post('/token', (req, res, next) => {
  const accessToken = jsonwebtoken.sign(
    {
      exp: 0 // The token is very expired
    },
    'dummy'
  )

  res.json({
    token_type: 'bearer',
    access_token: accessToken,
    refresh_token: accessToken,
    expires_in: 0
  })
})

// [GET] /user
app.get('/userinfo', (req, res, next) => {
  res.json({
    "sub"        : "83692",
    "name"       : "Alice Adams",
    "email"      : "alice@example.com",
    "department" : "Engineering",
    "birthdate"  : "1975-12-31"
  })
})

// -- export app --
module.exports = {
  path: '/oauth2mockserver',
  handler: app
}
