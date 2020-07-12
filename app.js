const http = require('http')
const https = require('https');
const express = require('express')
const app = express()
const mysql = require('mysql')
const connection = require('./mysqlConnection')
const cron = require('node-cron')

server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.write('Hello World')
  res.end()
})

//APIリクエスト定時実行

  let data = ""
  let pref = ""
  const url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures'
  const req = https.request(url, (res) => {
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

    req.on('error', (e) => {
      console.error(`error:${e.message}`)
    })
    req.end()
  })



// データベースからの取得
cron.schedule('57 23 * * *', () => {
  console.log(11111)
  console.log(3333)
})
// connection.query('select * from test1 where id = 13', ((error, results, fields) => {
//   if (error) throw error
//   // res.send(results)
//   console.log(results)
//   console.log("results:")
// }))

//       //削除
//       // connection.query(`delete from test1 where id = ${i}`, (err,result) => {
//       //   console.log("完了")
//       // })



app.listen(3000, (() => {
  console.log('listening on port 3000')
}))