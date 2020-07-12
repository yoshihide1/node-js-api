const express = require('express')
const router = express.Router()

router.get('/test', ((req, res) => {
  res.json({
    message: "this is user api"
  })
}))

module.exports = router