const router = require('express').Router()

const config = require('./config')
const social = require('./social')

const users = require('../model/users')

router.use('/social', social)

// [POST] /login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const valid = username.length && password === '123'

  if (!valid) {
    throw new Error('Invalid username or password')
  }

  let user = users.getUserById(username)
  if (!user) {
    user = users.createUser(username, 'local', config.generateRandomId())
  }

  const accessToken = config.generateUserToken(username)

  res.json({
    token: {
      accessToken
    }
  })
})

// [POST] /logout
router.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

// [GET] /user
router.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

module.exports = {
  router,
  config
}
