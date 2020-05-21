const express = require('express')
const router = express.Router()
const ExamStudentController = require('../controllers/examStudent')

router.get("/get-students-in-exam/:idExam", ExamStudentController.getStudentsInExam)

module.exports = router