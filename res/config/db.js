// Inisialisasi Mysql
const mysql = require('mysql2')

// Definisi Variabel dari HelperEnv
const {
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_USER
} = require('../helpers/env')

// Koneksi Database
const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

// Export agar bisa digunakan di models
module.exports = connection