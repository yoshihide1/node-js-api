require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

app.use(cors())
//API部分
app.get('/api/v1/today/', (req, res) => {//最新データ取得
  connection.query('select corona.pref_id, prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at = (select max(created_at) from corona)', (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      res.json(results)
    }
  })
})

//日付毎の集計
app.get('/api/v1/total/', (req, res) => {
  connection.query(`select date_format(created_at, '%Y-%m-%d') as date, sum(cases) as cases, sum(pcr) as pcr, sum(deaths) as deaths, sum(population) as population, sum(discharge) as discharge, sum(hospitalize) as hospitalize, sum(severe) as severe from corona group by date_format(created_at, '%Y%m%d') order by created_at desc limit 30`, (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      res.json(results)
    }
  })
})

//二日分
app.get('/api/v1/2day/', (req, res) => {
  connection.query(`select corona.pref_id, prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at in (select created_at from (select distinct created_at from corona order by 1 desc limit 2) t2)`, (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      res.json(results)
    }
  })
})

//県別
app.get('/api/v1/pref/', (req, res) => {
  connection.query(`select corona.*, pref.prefecture from corona join prefectures as pref on pref.pref_id = corona.pref_id and corona.pref_id =?`, [req.query.id], (error, results, fields) => {
    if (error) {
      console.log(error)
    } else {
      res.json(results)
    }
  })
})


app.listen(process.env.PORT || 3000)