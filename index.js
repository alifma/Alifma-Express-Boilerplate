
// Definisi Express Dasar
const express = require('express')
const app = express()

// DotEnv File
const { PORT } = require('./res/helpers/env')

// CORS
const cors = require('cors')
app.use(cors())

// Tambahkan Body Parser
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Routers
const users = require('./res/routes/users')
app.use(users)

// Image Path
app.use('/img', express.static('./public/img'))

//// History Router
// const history = require('connect-history-api-fallback')
// app.use(history({
//   verbose: true
// }))
// app.use('/dist', express.static('./public/dist'))
// app.use('/', express.static('./public/dist'))

// Start Server
app.listen(PORT, () => {
  console.log('server running on port ' + PORT)
})