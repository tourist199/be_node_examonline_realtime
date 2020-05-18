const express = require('express')
const router = express.Router()
const ExamController = require('../controllers/exam')

router.get("/get-exams-teacher", ExamController.getExamsByTeacher)

// router.get("/:page", ExamController.get_user)

router.post("/insertExam", ExamController.insertExam)

// router.delete("/:userId",checkAuth, ExamController.delete_user)

// router.post("/change-user-info",checkAuth, ExamController.change_user_info)

module.exports = router