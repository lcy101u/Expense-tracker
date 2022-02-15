const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')

module.exports = app => {
  //Initialize passport module
  app.use(passport.initialize())
  app.use(passport.session())

  //設定本地登入策略(Strategy)
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    userModel.findOne({email})
      .then(user => {
        if(!user) {
          // return done(null, false, req.flash('warning_msg', 'Email is not yet registered.'))//Method 1 passReqToCallback: true @LocalStrategy
          return done(null, false, { type: 'warning_msg', message: 'Email is not yet registered.'}) //Method 2 failureFlash: true @authenticate
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if(!isMatch) {
            // return done(null, false, req.flash('warning_msg', 'Email or password incorrect.'))
            return done(null, false, { type: 'warning_msg', message: 'Email or password incorrect.'})
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  //Facebook 驗證
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
  (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    userModel.findOne({ email })
      .then(user => {
        if(user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => userModel.create({ name, email, password: hash }))
          .then(user => done(null, user))
          .catch(err => done(err))
      })
      .catch(err => console.error(err))
  }))

  //設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    userModel.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))  //後面多放一個null 強調後面是空的
  })
}