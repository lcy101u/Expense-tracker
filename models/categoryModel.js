const mongoose = require('mongoose')
const Schema = mongoose.Schema
const categorySchema = mongoose.model('Category', new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
}))

module.exports = categorySchema