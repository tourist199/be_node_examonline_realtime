const mongoose = require('mongoose')

const examStudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: { type: mongoose.Schema.Types.ObjectId, ref : 'Exam' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
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
    }
})

module.exports = mongoose.model('ExamStudent', examStudentSchema)