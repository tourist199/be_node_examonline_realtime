const mongoose = require('mongoose')

const questionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    answers: { type: Array, required: true },
    result: { type: String, required: true },
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test'
    }
})

module.exports = mongoose.model('Question', questionSchema)