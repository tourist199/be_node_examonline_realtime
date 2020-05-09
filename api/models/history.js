const mongoose = require('mongoose')

const historySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: { type: mongoose.Schema.Types.ObjectId, ref : 'User' },
    examId : { type: mongoose.Schema.Types.ObjectId, ref : 'Exam' },
    scores : {type: Number, required: true},
    ans : {type: Array, required: true}
})

module.exports = mongoose.model('History', historySchema)