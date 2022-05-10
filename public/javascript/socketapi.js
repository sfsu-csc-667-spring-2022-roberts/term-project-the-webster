const io = require( "socket.io" )();
const socketapi = {
    io: io
};


const connectionEvent = function(socket) {
    console.log(" user connected  ")
    socket.on('message', function(msg) {
        console.log('message: ' + msg);
        io.emit('message', msg);
    });
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });
};

io.on('connection', connectionEvent);

module.exports = socketapi;