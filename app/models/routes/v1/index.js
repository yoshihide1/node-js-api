const express = require('express')
let router = express.Router()

router.use('/article', require('./article.js'))
router.use('/user', require('./user.js'))

module.exports = router

