const express = require('express')
const router = express.Router()
const passport = require('passport')
const userModel = require('../../models/userModel')
const bcrypt = require('bcryptjs')

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
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if(!name || !email || !password || !confirmPassword) {
      errors.push({ message: '所有欄位都是必填!'})
    }
    if(password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符。'})
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    userModel.findOne({email})
      .then(user => {
        if(user) {
          errors.push({ message: '此email已被註冊!'})
          console.log('User already exist.')
          return res.render('register', {
            errors, name, email, password, confirmPassword
          })
        }
        return bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash => userModel.create({name, email, password: hash}))
          .then(() => res.redirect('/'))
          .catch(err => console.err(err))    
      })
  })

router.get('/logout', (req, res) => {
  //passport 提供的函式
  req.logout()
  req.flash('success_msg', '已成功登出!')
  res.redirect('/users/login')
})

module.exports = router