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
  let data = ""
  let pref = ""
  const url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures'
  const req = https.request(url, (res) => {
    console.log('request')
    res.on('data', (chunk) => {
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
        // データベースへの追加
        connection.query(`insert into corona set ?`, prefData, (error, results, fields) => {
          if (error) {
            console.log(error)
          } else {
            console.log(data.name_ja)
          }
        })
      }
      connection.end()
    })
  })
  req.on('error', (e) => {
    console.error(`error:${e.message}`)
  })
  req.end()
};