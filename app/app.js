const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())

let port = process.env.PORT || 3000

let router = require('./models/routes/v1/')
app.use('/api/v1/', router)

app.listen(port)
console.log('listen on port' + port)

