const mongoose = require('mongoose')

const examSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required : true},
    description : {type: String, required: true},
    testId: { type: mongoose.Schema.Types.ObjectId, ref : 'Test' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
    timeStart: {type: Date, required: true},
    timeEnd: {type: Date, required: true},
})

module.exports = mongoose.model('Exam', examSchema)