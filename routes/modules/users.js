const express = require('express')
const router = express.Router()
const passport = require('passport')

router
  .route('/login')
  .get((req, res) => {
    res.render('login')
  })
  .post((req, res) => {
    const { email, password } = req.body

    //到DB找資料
  })

module.exports = router