const mongoose = require('mongoose')

const examStudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    listAnswer: { type: Array },
    ip: {
        type: String
    },
    countryCode: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    status: {
        type: String
    },
    submit: {
        type: Boolean
    },
    numQuestionDid: {
        type: Number
    },
    numQuestionDidCorrect: {
        type: Number
    }
})

module.exports = mongoose.model('ExamStudent', examStudentSchema)