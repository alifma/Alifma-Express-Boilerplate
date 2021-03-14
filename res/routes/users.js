const express = require('express')
const { singleUpload } = require('../helpers/upload')
const { cRegister, cLogin, cDetail, cActivate, cForgetToken, cForgetVerify, cUpdateUser} = require('../controllers/users')
const { authentication } = require('../helpers/auth')

const route = express.Router()
route
  .post('/api/register', cRegister)
  .post('/api/login', cLogin)
  .post('/api/reset', cForgetToken )
  .get('/api/reset', cForgetVerify )
  .get('/api/verify/:token', cActivate )
  .get('/api/user/:id', cDetail)
  .patch('/api/user/:id', authentication, singleUpload, cUpdateUser)

module.exports = route