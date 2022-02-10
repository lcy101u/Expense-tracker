const express = require('express')
const router = express.Router()
const passport = require('passport')
const userModel = require('../../models/userModel')

router
  .route('/login')
  .get((req, res) => {
    res.render('login')
  })
  .post(passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }))

router
  .route('/register')
  .get((req, res) => {
    res.render('register')
  })
  .post((req, res) => {
    
  })

module.exports = router