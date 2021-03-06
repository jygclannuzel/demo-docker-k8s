const express = require('express')
const proxy = require('express-http-proxy')
const cors = require('cors')

const { productsAPIURL, usersAPIURL } = require('./config')
const auth = require('./authentication')

const api = express()

// api.use(cors())

// User services
api.post('/users/register', proxy(usersAPIURL))
api.post(
  '/users/login',
  proxy(usersAPIURL, {
    proxyReqPathResolver: function (req) {
      return '/login'
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
      if (proxyRes.statusCode === 200) {
        console.log(proxyResData.toString('UTF-8'))
        const { id: userId, username, email } = JSON.parse(
          proxyResData.toString('UTF-8')
        )

        const isAdmin = true

        return JSON.stringify({
          message: 'Successful login',
          token: auth.sign({ userId, isAdmin }),
          user: {
            username,
            email,
            isAdmin
          }
        })
      }
      return proxyResData
    }
  })
)

// Product services
api.get('/products', proxy(productsAPIURL))
api.post('/products', auth.middleware, proxy(productsAPIURL))
api.get('/products/:id', auth.middleware, proxy(productsAPIURL))
api.delete('/products/:id', auth.middleware, proxy(productsAPIURL))
api.put('/products/:id', auth.middleware, proxy(productsAPIURL))

module.exports = api