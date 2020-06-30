const ExamStudent = require('../models/exam_student')

module.exports.getHistoryExamStudent = (req, res) => {
    let { userData } = req

    ExamStudent.find({ studentId: userData.userId })
        .populate({
            path: 'examId',
            populate: { 
                path: 'testId',
                select: 'totalQuestion type'
            }
        })
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