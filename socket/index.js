const socketio = require('socket.io');
const db = require('../db/index');
const { addSocket } = require('../utils/socket_store');
const io = socketio();





io.on('connection', socket => {
    console.log("connected")
 
     const cook = socket.handshake.headers.cookie
     const ref = socket.handshake.headers.referer
 
     socket.on('disconnect', () => {
      console.log('disconnected!!')
    })

   
    //  console.log(`cookie = ${cook}`)
    //  console.log(`ref = ${ref}`)
     const user = cook
     console.log(`user socket cookie = ${user}`)
     cookieObj  = {};

     if (cook) {
       console.log(cook)
     
       const split = cook.split('; ');

        split.forEach(s => {
          const pair = s.split('=');
          cookieObj[pair[0]] = pair[1];
        });
          
          const value = String(cookieObj['connect.sid'])
          const _x = value.indexOf('%')
          const _y = value.indexOf('.')

        socket_id = value.substring(_x + 3, _y)

        db.any(`SELECT * FROM session where sid=$1`, [socket_id])
        .then(results => {
          const sess = results[0];
            console.log(sess)
            if(sess['sess']['user_id']){
              const _session = sess['sess'];
              const _user_id = sess['sess']['user_id'];

              addSocket(_user_id, _session)
            }
          // console.log(sess['sess']['user_id'])
        
          
        })


    }


    socket.on('ping', () => {
      io.emit('pong')
    })

    socket.on('chat-message', msg => {
      console.log(msg)
      io.emit('message_back', msg)
    })


    // const sessions = db.any(query);
    // console.log(`SESSION DATA ==>  ${sessions} `);

       
     socket.on('test-event1', () => {
        console.log('got TEST EVENT 1 from client')
     })
    
  
 
    socket.on('login', () => {
      console.log('user is logged in ')
    })
    
    
    socket.on('hey',  () => {
       console.log("hello from front end")
    })
  
  })




module.exports = io;

