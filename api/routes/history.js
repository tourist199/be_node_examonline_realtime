const express = require('express')
const router = express.Router()
const HistoryController = require('../controllers/history')

router.get("/get-history-by-student", HistoryController.getHistoryExamStudent)

module.exports = router