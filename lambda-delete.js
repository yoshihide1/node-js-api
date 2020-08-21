//AWS lambda
const mysql = require('mysql')
const https = require('https')
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})


exports.handler = (event) => {

  // 古いデータ削除
  connection.query(`delete from corona where created_at = (select min(created_at)) limit 47`, (error, results, fields) => {
    if (error) {
      console.log(error)
    }
  })
  connection.end()
  console.log('完了')
}
