require('dotenv').config();
const express = require('express')
const app = express()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})
//API部分
app.get('/api/v1/', (req, res) => {//最新データ取得

  connection.query('select prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at = (select max(created_at) from corona)', (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      res.json(results)
    }
  })
})

app.listen(process.env.PORT || 3000)

