const bcrypt = require('bcryptjs')

// set env if NODE_ENV isn't production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const userModel = require('../userModel')
const categoryModel = require('../categoryModel')
const recordModel = require('../recordModel')

const users = require('./user.json').results
const records = require('./record.json').results

db.once('open', async () => {
  //First, add categoryId to record table
  const categories = await categoryModel.find().lean().then()
  records.forEach(record => {
    record.categoryId = categories.find(category => category.name === record.category)._id
  })

  //Second, add userId to record table
  const resolve = users.map(async user => {
    const { name, email, password, useRecordId } = user

    //check if user exists
    let currentUser = await userModel.findOne({email})
    if(!currentUser) {
      //insert user into db
      const hashedPassword = await bcrypt.hashSync(password, 10) //const hash = bcrypt.hashSync(myPlaintextPassword, saltRounds); from npm bcrypt
      currentUser = await userModel.create({name, email, password: hashedPassword})
    }

    //find record belongs to current user
    let currentUserRecords = records.filter(record => useRecordId.includes(record.id))

    currentUserRecords.forEach(record => {
      delete record['id']
      delete record['category']
      record.userId = currentUser._id
    })

    return await recordModel.create(currentUserRecords)
  })

  Promise.all(resolve)
    .then(() => {
      console.log('Record seeder created successfully!')
      db.close()
      process.exit()
    })
    .catch(err => console.log(err))
})