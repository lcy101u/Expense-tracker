const express = require('express')
const router = express.Router()

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

  })

router.get('/:id/edit', (req, res) => {
  
})

module.exports = router