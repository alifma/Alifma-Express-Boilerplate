const nodemailer = require('nodemailer')
const connection = require('../config/db')
module.exports = {
    mCheckEmail: (email) => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE email='${email}'`, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    },
    mRegister: (dataUser) => {
      return new Promise((resolve, reject) => {
        connection.query(`INSERT into users set ?`, dataUser, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    },
    mDetail: (id) => {
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM users WHERE id = ${id}`, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    },
    mUpdateUser: (data, id) => {
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE users SET ? WHERE id=?`, [data, id],
          (error, result) => {
            if (error) {
              reject(new Error(error))
            } else {
              resolve(result)
            }
          })
      })
    },
    // nodemailer
    mSendMail: async (targetEmail, title, mailData) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      let info = await transporter.sendMail({
        from: `"SMTP Development" <${process.env.SMTP_USER}>`, // sender address
        to: targetEmail, // list of receivers
        subject: title, // Subject line
        html: mailData, // html body
      });
    }
  }