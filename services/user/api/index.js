'use strict'

const { login } = require('./login')
const { register } = require('./register')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const router = new Router()

router.use(bodyParser())

// Health check of service
router.get('/healthcheck', (ctx) => {
  ctx.body = 'Users Service is up!'
})

// User management
router.post('/users/register', register)
router.post('/login', login)

module.exports = router