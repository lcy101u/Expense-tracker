const express = require('express')
const router = express.Router()
const moment = require('moment')
const recordModel = require('../../models/recordModel')
const categoryModel = require('../../models/categoryModel')

router.get('/', (req, res) => {
   const userId = req.user._id
    console.log(req.query)
    const categoryNames = []
    const recordsInfo = []
    const categorySortName = req.query.category_bar || '全部類別'
    categoryModel.find()
        .lean()
        .then(categories => {
            categories.filter(category => {
                categoryNames.push(category.name)
            })
            recordModel.find({ userId })
                .populate('categoryId')
                .sort({ date: 'desc', id: 'asc' })
                .lean()
                .then(records => {
                    let totalAmount = 0
                    records.filter(record => {
                        if ((categorySortName === '全部類別') || (categorySortName === record.categoryId.name)) {
                            totalAmount += Number(record.amount)
                            recordsInfo.push({
                                id: record._id,
                                name: record.name,
                                date: moment(record.date).format('YYYY/MM/DD'),
                                amount: record.amount,
                                icon: record.categoryId.icon
                            })
                        }
                    })
                    res.render('index', { categories: categoryNames, records: recordsInfo, totalAmount, category: categorySortName })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

})

module.exports = router