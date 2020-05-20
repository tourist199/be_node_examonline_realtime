const express = require('express')
const router = express.Router()
const ExamController = require('../controllers/exam')

router.get("/get-exam/:id", ExamController.getExamById)

router.get("/get-exams-teacher", ExamController.getExamsByTeacher)

router.post("/insertExam", ExamController.insertExam)

router.get("/get-exams-student", ExamController.getExamsStudent)

// router.post("/change-user-info",checkAuth, ExamController.change_user_info)

module.exports = router