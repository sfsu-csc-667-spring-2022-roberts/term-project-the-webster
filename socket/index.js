const socketio = require('socket.io');
const db = require('../db/index');
const { addSocket } = require('../utils/socket_store');
const io = socketio();

io.on('connection', socket => {
  const cook = socket.handshake.headers.cookie
  const ref = socket.handshake.headers.referer
  socket.on('disconnect', () => {
    console.log('disconnected!!')
  })
  const user = cook
  cookieObj = {};
  if (cook) {
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
        if (results.length > 0) {
          const sess = results[0];
          if (sess['sess']['user_id']) {
            const _session = sess['sess'];
            const _user_id = sess['sess']['user_id'];
            addSocket(_user_id, _session)
          }
        } else {
          console.log("NO user socket yet ")
        }
      })
  }
  let gameId;
  let lobbyId;
  if (socket.handshake.headers.referer.includes('/game/')) {
    const pathArray = socket.handshake.headers.referer.split('/');
    gameId =
      pathArray.length === 5 && pathArray[3] === 'game' ? pathArray[4] : null;
  }
  if (socket.handshake.headers.referer.includes('/lobby')) {
    const pathArray = socket.handshake.headers.referer.split('/');
    lobbyId =
      pathArray.length === 5 && pathArray[3] === 'lobby' ? pathArray[4] : null;
  }
  if (gameId) {
    socket.join('room' + gameId)
  };
  if (lobbyId) {
    socket.join('lobby' + lobbyId)
  }

  socket.on('ping', () => {
    io.emit('pong')
  })

  socket.on('chat-message', msg => {
    let dest;
    if (msg.destination == 'game') {
      dest = 'room' + gameId
    }
    if (msg.destination == 'lobby') {
      dest = 'lobby' + lobbyId

    }
    io.sockets.to(dest).emit('message_back', msg)
  })
})

module.exports = io;

