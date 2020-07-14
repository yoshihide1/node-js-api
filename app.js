const http = require('http')
const https = require('https');
const express = require('express')
const app = express()
const connection = require('./mysqlConnection')
const cron = require('node-cron')

//APIリクエスト定時実行

let data = ""
let pref = ""
const url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures'
const dbReq = https.request(url, (res) => {
  res.on('data', function (chunk) {
    data += chunk
  })
  res.on('end', () => {
    pref = JSON.parse(data)

    for (let i in pref) {
      let data = pref[i]
      let prefData = {
        pref_id: data.id,
        population: data.population,
        cases: data.cases,
        deaths: data.deaths,
        pcr: data.pcr,
        hospitalize: data.hospitalize,
        severe: data.severe,
        discharge: data.discharge,
        created_at: data.last_updated.cases_date
      }

      //データベースへの追加
      connection.query(`insert into corona set ?`, prefData, (error, results, fields) => {
        if (error) throw error
        console.log("DB", [i])
      })
    }
  })
})

cron.schedule('57 23 * * *', () => {
  dbReq.on('error', (e) => {
    console.error(`error:${e.message}`)
  })
  dbReq.end()
})

//API部分
app.get('/api/v1/', (req, res) => {//最新データ取得

  connection.query('select prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at = (select max(created_at) from corona)', ((error, results, fields) => {
    if (error) throw error
   return res.json(results)
  }))
})

app.listen(process.env.PORT || 3000)

