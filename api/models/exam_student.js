const mongoose = require('mongoose')

const examStudentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    examId: { type: mongoose.Schema.Types.ObjectId, ref : 'Exam' },
    StudentId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
})

module.exports = mongoose.model('ExamStudent', examStudentSchema)