const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('express-jwt')
const jsonwebtoken = require('jsonwebtoken')

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// JWT middleware
app.use(
  jwt({
    secret: 'dummy'
  }).unless({
    path: ['/api/auth/login', '/api/auth/refresh']
  })
)

// Refresh tokens
const refreshTokens = {}

// -- Routes --

// [POST] /login
app.post('/login', (req, res, next) => {
  const { username, password } = req.body
  const valid = username.length && password === '123'
  const expiresIn = 15;
  const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1

  if (!valid) {
    throw new Error('Invalid username or password')
  }

  const accessToken = jsonwebtoken.sign(
    {
      username,
      picture: 'https://github.com/nuxt.png',
      name: 'User ' + username,
      scope: ['test', 'user']
    }, 'dummy', {
      expiresIn
    }
  )

  refreshTokens[refreshToken] = {
    accessToken,
    user: {
      username,
      picture: 'https://github.com/nuxt.png',
      name: 'User ' + username,
    }
  }

  res.json({
    token: {
      accessToken,
      refreshToken,
      expiresIn
    }
  })
})

/*app.post('/refresh', (req, res, next) => {
  const { refresh_token } = req.body
  const user = req.user;

  if((refresh_token in refreshTokens) && jsonwebtoken.verify(refreshTokens[refresh_token]['accessToken'], 'dummy')) {
    const expiresIn = 15;
    const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1;
    const accessToken = jsonwebtoken.sign(
        {
          user: user.username,
          picture: 'https://github.com/nuxt.png',
          name: 'User ' + user.username,
          scope: ['test', 'user']
        }, 'dummy', {
          expiresIn
        }
    )

    refreshTokens[refreshToken] = accessToken

    res.json({
      token: {
        accessToken,
        refreshToken,
        expiresIn
      }
    })
  } else {
    res.sendStatus(401)
  }
})*/

app.post('/refresh', (req, res, next) => {
  const { refresh_token } = req.body

  if((refresh_token in refreshTokens)) {
    const user = refreshTokens[refresh_token].user
    const expiresIn = 15;
    const refreshToken = Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
    const accessToken = jsonwebtoken.sign(
      {
        user: user.username,
        picture: 'https://github.com/nuxt.png',
        name: 'User ' + user.username,
        scope: ['test', 'user']
      }, 'dummy', {
        expiresIn
      }
    )

    refreshTokens[refreshToken] = {
      accessToken,
      user: refreshTokens[refresh_token].user
    }

    res.json({
      token: {
        accessToken,
        refreshToken,
        expiresIn
      }
    })
  } else {
    res.sendStatus(401)
  }
})

// [GET] /user
app.get('/user', (req, res, next) => {
  res.json({ user: req.user })
})

app.get('/test1', (req, res, next) => {
  res.json({ user: req.user })
})

app.get('/test2', (req, res, next) => {
  res.json({ user: req.user })
})

app.get('/test3', (req, res, next) => {
  res.json({ user: req.user })
})

app.get('/test4', (req, res, next) => {
  res.json({ user: req.user })
})

app.get('/test5', (req, res, next) => {
  res.json({ user: req.user })
})

// [POST] /logout
app.post('/logout', (req, res, next) => {
  res.json({ status: 'OK' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

// -- export app --
module.exports = {
  path: '/api/auth',
  handler: app
}
