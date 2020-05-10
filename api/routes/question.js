const express = require('express')
const router = express.Router()
const QuestionController = require('../controllers/question')

router.post("/insertManyQuestion", QuestionController.insertManyQuestion)

router.get("/:testId", QuestionController.getQuestionsByTestId)

module.exports = router