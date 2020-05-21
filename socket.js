let ExamStudent = require('./api/models/exam_student')
let exam = require('./utils/exam')

/**
 * REALTIME
 */


module.exports = (server) => {
    let io = require('socket.io')(server);
    initializeSocket(io)
}
function initializeSocket(io) {
    io.on("connection", (socket) => {
        console.log("a user connected ...");

        socket.on("new_visitor", (visitor) => {
            console.log("new_visitor", visitor)
        })

        socket.on("disconnect", () => {
            console.log("user disconnected")
        })
    })
}

/**
 * REALTIME
 */