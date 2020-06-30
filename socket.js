let ExamStudent = require('./api/models/exam_student')
let { updateStatusStudentExam, changeStatusStudentDisconnect, changeAnswerStudent } = require('./utils/examRealtime')

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

        /**
         * Room EXAM
         */

        socket.on("student_join", async (data) => {
            socket.examId = data.examId
            socket.studentId = data.studentId
            await updateStatusStudentExam(data)
            console.log("student_join", data)
            socket.broadcast.emit(`change_status_student_room_${data.examId}`)
        })

        socket.on("change_answer_student", async (data) => {
            socket.examId = data.examId
            socket.studentId = data.studentId
            await changeAnswerStudent(data)
            console.log("change_answer_student", data)
            socket.broadcast.emit(`change_answer_student_room_${data.examId}`)
        })

        socket.on("submit_exam", (data) => {
            socket.examId = data.examId
            // socket.studentId = data.studentId
            console.log("submit")
            socket.broadcast.emit(`change_answer_student_room_${data.examId}`)
        })

        socket.on("leave_room", async () => {
            console.log("user leave room")
            await changeStatusStudentDisconnect({
                examId: socket.examId,
                studentId: socket.studentId
            })
            socket.broadcast.emit(`change_status_student_room_${socket.examId}`)
        })

        socket.on("update_test",  () => {
            socket.broadcast.emit(`update_test_student`)
            console.log('chay dc');
            
        })

        socket.on("disconnect", async () => {
            console.log("user disconnected")
            await changeStatusStudentDisconnect({
                examId: socket.examId,
                studentId: socket.studentId
            })
            socket.broadcast.emit(`change_status_student_room_${socket.examId}`)
        })
    })
}

/**
 * REALTIME
 */