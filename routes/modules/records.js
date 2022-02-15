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
  .get((req, res) => {

  })
  .put((req, res) => {

  })
  .delete((req, res) => {
    const userId = req.user._id
    const _id = req.params.id

    recordModel.findOneAndRemove({ userId, _id })
      .then(() => res.redirect('/'))
      .catch(error => console.log(error))
  })

router.get('/:id/edit', (req, res) => {
  
})

module.exports = router