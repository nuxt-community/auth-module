import express from 'express'

// Generated at http://jwtbuilder.jamiekurtz.com/
const TOKEN_NEVER_EXPIRING =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1ODI0OTE3OTcsImV4cCI6MzI0NzIxNDQwMDAsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.XMKfOS3xcScObdkZiRUxI5ZEVd-hh7TTq6wkykFMZCA'

// Create app
const app = express()

// -- Routes --

// [POST] /token
app.post('/token', (_req, res) => {
  res.json({
    token_type: 'bearer',
    access_token: TOKEN_NEVER_EXPIRING,
    refresh_token: TOKEN_NEVER_EXPIRING
  })
})

// [GET] /user
app.get('/userinfo', (_req, res) => {
  res.json({
    sub: '83692',
    name: 'Alice Adams',
    email: 'alice@example.com',
    department: 'Engineering',
    birthdate: '1975-12-31',
    picture: 'https://github.com/nuxt.png'
  })
})

// [GET] /cats
app.get('/cats', (_req, res) => {
  res.json(['Tiger', 'Max', 'Smokey'])
})

// -- export app --
export default {
  path: '/oauth2mockserver',
  handler: app
}
