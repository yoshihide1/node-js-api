require('dotenv').config();

const express = require('express')
const app = express()

const mysql = require('mysql')
const conn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

app.get('/', (req, res) => {//最新データ取得
  conn.query('select prefecture, cases, population, deaths, pcr, hospitalize, severe, discharge, created_at from corona join prefectures as pref on corona.pref_id = pref.pref_id where created_at = (select max(created_at) from corona)', (err, rows, fields) => {
    if (err) {
      console.log(err)
    } else {
      res.send(rows)
    }
  })
})

app.listen(process.env.PORT || 3000)


// let data = ""
// let pref = ""
// const url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures'
// const dbReq = https.request(url, (res) => {
//   console.log('request')
//   res.on('data', (chunk) => {
//     data += chunk
//   })
//   res.on('end', () => {
//     pref = JSON.parse(data)
//     for (let i in pref) {
//       let data = pref[i]
//       let prefData = {
//         pref_id: data.id,
//         population: data.population,
//         cases: data.cases,
//         deaths: data.deaths,
//         pcr: data.pcr,
//         hospitalize: data.hospitalize,
//         severe: data.severe,
//         discharge: data.discharge,
//         created_at: data.last_updated.cases_date
//       }
//       // データベースへの追加
//       // connection.query(`insert into corona set ?`, prefData, (error, results, fields) => {
//       //   if (error) {
//       //     console.log(error)
//       //   } else {
//       //     console.log("DB", [i])
//       //   }
//       //   console.log(222222)
//       // })
//       console.log(22)
//     }
//   })
// })

//デターベースへのデータ追加、定時
// cron.schedule('57 23 * * *', () => {
//   dbReq.on('error', (e) => {
//     console.error(`error:${e.message}`)
//   })
//   dbReq.end()
// })
