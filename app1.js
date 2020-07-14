const express = require('express')
const app = express()
const connection = require('./mysqlConnection')

app.get('/', (req, res) => {//最新データ取得
  console.log('OK')
  connection.query('select prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at = (select max(created_at) from corona)', ((error, results, fields) => {
    if (error) throw error
    res.json(results)
    console.log(res.json(results))
  }))
})

app.listen(process.env.PORT || 3000)
