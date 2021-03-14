const express = require('express')
const { singleUpload } = require('../helpers/upload')
const { cRegister, cLogin, cDetail, cActivate} = require('../controllers/users')

const route = express.Router()
route
.post('/api/register', cRegister)
.post('/api/login', cLogin)
.get('/api/user/:id', cDetail)
.get('/api/verify/:token', cActivate )
  // .post('/api/login', login)
  // .patch('/api/user/:id', authentication, singleUpload, patchUser)

module.exports = route