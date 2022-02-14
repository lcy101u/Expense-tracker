if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const categoryModel = require('../categoryModel')
const categories = require('./category.json').results

db.once('open', async () => {
  await categoryModel.create(categories)
  console.log('Category seeds created successfully!')
  db.close()
  process.exit()
})