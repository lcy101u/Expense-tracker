const express = require('express')
const router = express.Router()
const moment = require('moment')

const recordModel = require('../../models/recordModel')
const categoryModel = require('../../models/categoryModel')

router.get('/new', (req, res) => {
  res.render('new')
})
router.post('/', (req, res) => {
  res.render('index')
})

router
  .route('/:id')
  .put((req, res) => {
    req.body.userId = userId = req.user._id
    _id = req.params.id

    recordModel.findOneAndUpdate({ _id, userId }, req.body)
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })
  .delete((req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    recordModel.findOneAndRemove({ userId, _id })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

router.get('/:id/edit', async (req, res) => {
   const userId = req.user._id

  const _id = req.params.id

  let categoryArray = await categoryModel.find({}).lean().then()

  // find a currentRecord with recordID(_id) and userId
  recordModel.findOne({ _id, userId })
    .populate('categoryId', 'name')
    .lean()
    .then((currentRecord) => {
      // transfer date to YYYY-MM-DD format 
      // YYYY -> Year
      // MM -> Month
      // DD -> Day
      currentRecord.date = moment(currentRecord.date).format('YYYY-MM-DD')
      res.render('edit', { categoryArray, currentRecord })
    })

})

module.exports = router