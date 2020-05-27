const ExamStudent = require('../models/exam_student')
const mongoose = require('mongoose')
var convertToObjectId = require('mongodb').ObjectId;


module.exports.getStudentsInExam = async (req, res) => {
    let idExam = req.params.idExam

    ExamStudent.find({ examId: idExam })
        .populate('studentId')
        .populate({
            path: 'examId',
            // Get info test of exam
            populate: { path: 'testId' }
          })
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                result: {
                    lsStudent: docs
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "fails",
                }
            });
        });
}

module.exports.getInfoExamByStudent = (req, res) => {
    let idExam = req.params.idExam
    let { userData } = req

    ExamStudent.findOne({ examId: idExam, studentId: userData.userId })
        .select('listAnswer')
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                result: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "fails",
                }
            });
        });
}

module.exports.studentSubmitExam = (req, res) => {
    console.log(123);
    
    let { userData } = req
    ExamStudent
        .findOneAndUpdate(
            { examId: req.body.examId, studentId: userData.userId },
            { submit: true },
            { new: true }
        )
        .exec()
        .then(docs => {
            res.status(202).json({
                success: true,
                result: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "SUBMIT FAILED"
                }
            });
        });
}