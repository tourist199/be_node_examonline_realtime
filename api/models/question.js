const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String },
    image: { type: String },
    description: { type: String},
    answers: { type: Array},
    result: { type: String },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }
})

module.exports = mongoose.model('Question', questionSchema)