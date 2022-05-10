/*
*/



var socket = io();

console.log(socket)


// const socketapi = {
//     io: io
// };

// Add your socket.io logic here!

socket.on('connection', socket => {
    console.log(`^^^ a user connected! :) `);
    socket.emit('hi', "_user_ connected "); 
    
   
    
    socket.on('hi', (msg)=> {
    //  io.emit('hi', msg )
    })
    
    socket.on('chat message', (msg) => {
       // io.emit('chat message', msg);
    });



  });
  





// // end of socket.io logic

// module.exports = socketapi;