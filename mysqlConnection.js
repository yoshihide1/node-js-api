const mysql = require('mysql')
require('dotenv').config();

const dbConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
}

let connection

function handleDisconnect() {
  console.log('create mysql')
  connection = mysql.createConnection(dbConfig)
  console.log(11111)

  connection.connect((err) => {
    if (err) {
      console.log('error:', err)
      setTimeout(handleDisconnect, 2000)
    }
    console.log(err)
    console.log("connection")
  })

  connection.on('error', ((err) => {
    console.log('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log(err)
      handleDisconnect()
    } else {
      console.log(err)
      throw err
    }
  }))
  console.log("module1")
  module.exports = connection
  console.log("module2")
}

handleDisconnect()
console.log("最後")