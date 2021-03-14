const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment');
const { error, success } = require('../helpers/response')
const { mCheckEmail, mRegister, mDetail, mSendMail, mUpdateUser } = require('../models/users')
module.exports = {
  cRegister : async (req, res) => {
    const body = req.body
    try {
      if (body.email && body.password && body.username ) {
        mCheckEmail(body.email)
          .then(async (response)=>{
            if(response.length >= 1) {
              if (response[0].active === 0) {
                error(res, 400, 'Registration Failed', 'Email already registered and need activation')
              } else {
                error(res, 400, 'Registration Failed', 'Email already registered, Please login')
              }
            }else{
              const salt = await bcrypt.genSalt(10)
              const password = await bcrypt.hash(body.password, salt)
              const user = {
                username: body.username,
                email: body.email,
                active: 0,
                password
              }
              mRegister(user)
              .then(async (resRegist)=> {
                const dataUser = {
                  email: body.email,
                  id: resRegist.insertId
                }
                const jwttoken = jwt.sign(dataUser, process.env.JWT_SECRET)
                const link = `${process.env.IP_SERVER}:${process.env.PORT}/api/verify/${jwttoken}`
                const mailData =  `
                <div style="text-align:center">
                <h1>Please Confirm Your Account</h1>
                <p> Click the link below to confirm you account</p>
                <a href="${link}">Verif your account</a>
                </div>
                `
                mSendMail(body.email, "Account Confirmation", mailData)
                  .then((resVerif) => {
                    success(res, 200, 'Registration Success, Check your email to verif your account!', {})
                  })
                  .catch((err)=> error(res, 400, 'Registration Failed', err.message))
              })
              .catch((err)=> error(res, 400, 'Registration Failed', err.message))
            }
          })
          .catch((err)=> error(res, 400, 'Registration Failed', err.message))
      } else {
        error (res, 400, 'Empty Field Found', 'Please Fill All Data') 
      }
    } catch {
      error(res, 500, 'Internal Server Error', '')
    }
  },
  // Login
  cLogin : (req, res) => {
    const body = req.body
    try {
      if (body.email && body.password) {
        mCheckEmail(body.email)
        .then(async (response)=>{
          if(response.length == 1){
            const checkPassword = await bcrypt.compare(body.password, response[0].password)
            if(checkPassword) {
              if (response[0].active === 1) {
                const dataUser = {
                  email: response[0].email,
                  id: response[0].id
                }
                const jwttoken = jwt.sign(dataUser, process.env.JWT_SECRET)
                success(res, 200, 'Login Success', {}, {user: response[0], token: jwttoken})
              } else {
                error(res, 400, 'Login Failed', 'User not Activated, Please Check Your email')
              }
            }else{  
              error(res, 400, 'Login Failed', 'Wrong Password')
            }
          }else{
            error(res, 400, 'Login Failed', 'Email is not registered')
          }
        })
        .catch((err)=> error(res, 400, 'Login Failed', err.message))
      } else {
        error(res, 500, 'Empty Field Found', 'Please Fill All Data')
      }
    } catch {
      error(res, 500, 'Internal Server Error', '')
    }
  },
  cDetail : (req, res) => {
    const id = req.params.id
    mDetail(id)
      .then((response) => {
        success(res, 200, 'Display Detail User Success', {},  response)
      })
      .catch((err) => {
        error(res, 500, 'Internal Server Error', err.message, {})
      })
  },
  cActivate: async(req, res) => {
    try {
      const token = req.params.token
      const currDate = moment().format('YYYY-MM-DDThh:mm:ss.ms');
      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
          error(res, 400, 'Invalid Token', err.message, {})
        }else{
          mDetail(decoded.id)
            .then((responseDetail) => {
              if (responseDetail[0].active === 1) {
                success(res, 200, 'User dont need any activation.', {},  {})
              } else {
                mUpdateUser({active: 1, 'updated_at': currDate}, decoded.id)
                  .then((response) => {
                    if (response.affectedRows != 0) {
                      success(res, 200, 'User Activated, You can login now!', {}, {})
                    } else {
                      error(res, 400, 'Nothing Patched, Wrong ID', {}, {})
                    }
                  })
                  .catch((err) => {
                    error(res, 400, 'Wrong Data Type Given', err.message, {})
                  })
              }
            })
            .catch((err) => {
              error(res, 500, 'Internal Server Error', err.message, {})
            })
        }
      })
    } catch (err) {
      error(res, 500, 'Internal Server Error', err.message, {})
    }
  },
  cForgetToken: async(req, res) => {
    const body = req.body
    mCheckEmail(body.email)
    .then(async (response)=>{
      if(response.length === 1){
        const dataUser = {
          email: body.email,
          id: response[0].id
        }
        const jwttoken = jwt.sign(dataUser, process.env.JWT_SECRET)
        const link = `${process.env.IP_SERVER}:${process.env.PORT}/api/reset?token=${jwttoken}`
        const mailData = `
        <div style="text-align:center">
          <h1>Click To Reset Your Account</h1>
          <p> Click the link below to Reset you account</p>
          <a href="${link}">Reset your account</a>
        </div>
        `
        mSendMail(body.email, "Reset Account", mailData)
          .then((resVerif) => {
            success(res, 200, 'Reset Account Success, Check your email to reset your account!', {})
          })
          .catch((err) => error(res, 400, 'Reset Account Failed', err.message))
      }else{
        error(res, 400, 'Reset Password Failed', 'Email is not registered')
      }
    })
    .catch((err)=> error(res, 400, 'Reset Password Failed', err.message))
  },
  cForgetVerify: async(req, res) => {
    try {
      const token = req.query.token
      await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
          error(res, 400, 'Invalid Token', err.message, {})
        }else{
          mDetail(decoded.id)
            .then((responseDetail) => {
                success(res, 200, 'Token Verified!', {}, {id: responseDetail[0].id})
            })
            .catch((err) => {
              error(res, 500, 'Internal Server Error', err.message, {})
            })
        }
      })
    } catch (err) {
      error(res, 500, 'Internal Server Error', err.message, {})
    }
  }
}