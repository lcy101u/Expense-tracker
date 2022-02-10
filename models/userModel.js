const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
//第一個參數 'User' 會讓mongoose 在mongoDB 會建立 名叫 users 的資料表
module.exports = mongoose.model('User', userSchema)