const ExamStudent = require ('../models/exam_student')
const mongoose = require('mongoose')

module.exports.getStudentsInExam = async (req, res) => {
    let idExam = req.params.idExam
    console.log(idExam, '2222');
    
    ExamStudent.find({ examId: idExam })
        .populate('studentId')
        .exec()
        .then(docs => {
            let lsStudent = docs.map(item => item.studentId)
            res.status(200).json({
                lsStudent
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