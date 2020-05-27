const express = require('express')
const router = express.Router()
const ExamStudentController = require('../controllers/examStudent')

router.post("/submit-exam", ExamStudentController.studentSubmitExam)

router.get("/get-students-in-exam/:idExam", ExamStudentController.getStudentsInExam)

router.get("/get-info-by-student/:idExam", ExamStudentController.getInfoExamByStudent)

module.exports = router