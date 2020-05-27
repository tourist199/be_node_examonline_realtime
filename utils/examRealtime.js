const ExamStudent = require('../api/models/exam_student')

module.exports.updateStatusStudentExam = async (data) => {
    let rs = await ExamStudent
        .findOneAndUpdate(
            { examId: data.examId, studentId: data.studentId },
            data,
            { new: true }
        )
        .exec()
    return rs
}

module.exports.changeStatusStudentDisconnect = async (data) => {
    let rs = await ExamStudent
        .findOneAndUpdate(
            { examId: data.examId, studentId: data.studentId },
            { status: 'OFFLINE' },
            { new: true }
        )
        .exec()
    return rs
}

module.exports.changeAnswerStudent = async (data) => {
    let rs = await ExamStudent
        .findOneAndUpdate(
            { examId: data.examId, studentId: data.studentId },
            {
                listAnswer: data.listAnswer,
                numQuestionDidCorrect: data.numQuestionDidCorrect,
                numQuestionDid: data.listAnswer.length || 0,
            },
            { new: true }
        )
        .exec()
    return rs
}
