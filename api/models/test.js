const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    createAt: { type: Date, default: Date.now },
    status: { type: String, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    totalQuestion: {
        type: Number,
        default: 0
    },
    type: String
})

module.exports = mongoose.model('Test', testSchema)