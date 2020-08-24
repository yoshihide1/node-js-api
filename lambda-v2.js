const mysql = require('mysql')
const https = require('https')
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})

exports.handler = (event) => {
  function createdCheck() {
    return new Promise((resolve) => {
      //データベース最終更新日の取得
      connection.query('select created_at from corona order by 1 desc limit 1', (error, results, fields) => {
        const dbLastUpdate = results[0].created_at
        resolve(dbLastUpdate)
      })
    })
  }
  function coronaGetData() {
    return new Promise((resolve, reject) => {
      let data = ""
      const url = 'https://covid19-japan-web-api.now.sh/api/v1/prefectures'
      const req = https.request(url, (res) => {
        console.log('request')
        res.on('data', (chunk) => {
          data += chunk
        })
        res.on('end', () => {
          const jsonData = JSON.parse(data)
          resolve(jsonData)
        })
      })
      req.on('error', (e) => {
        console.log(`error:${e.message}`)
      })
      req.end()
    })
  }

  function dbInsert(coronaData) {
    console.log('取得')
    for (let i in coronaData) {
      let data = coronaData[i]
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
    console.log('end')
    connection.end()
  }

  createdCheck().then(dbLastUpdate => {
    coronaGetData().then(result => {
      const apiLastUpdate = result[0].last_updated.cases_date
      if (dbLastUpdate == apiLastUpdate) {//DBと取得先の更新日のチェック
        console.log('重複してます')
        connection.end()
        return
      } else {
        console.log('データ取得開始')
        dbInsert(result)
      }
    })
  })
}