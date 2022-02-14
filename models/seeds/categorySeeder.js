if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const categoryModel = require('../categoryModel')
const categories = require('./category.json').results

db.once('open', async () => {
 
  let resolve = categories.map(category => {
    const { name } = category
    return categoryModel.findOne({name})
      .lean()
      .then(async currentCategory => {
        if(currentCategory) return
        return await categoryModel.create(category)
      })
      .catch(err => console.log(err))
  })

  Promise.all(resolve)
    .then(() => {
      console.log('Category seeds created successfully!')
      db.close()
      process.exit()
    })
})