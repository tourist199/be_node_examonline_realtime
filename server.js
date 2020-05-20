const http = require('http');
const app = require('./app')
const socket = require('./socket')
const port =  process.env.PORT || 3000;

const server = http.createServer(app);
console.log('start server. port: ', port);


server.listen(port)


/**
 * Realtime
 */
socket(server);