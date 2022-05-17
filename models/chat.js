const { bindComplete } = require("pg-protocol/dist/messages");
const game = require("../db/game");
const db = require('../db');

const sendMessage = (user_id, game_id, message) => {
  let baseSQL = (`INSERT INTO messages (sender_id, game_id, text) VALUES ($1, $2, $3)`);
  return db.any(baseSQL, [user_id, game_id, message]);
};

const getMessages = (game_id) => {
  let baseSQL = (`SELECT sender_id, text FROM messages WHERE game_id=$1 ORDER BY sender_id`);
  return db.any(baseSQL, [game_id])
  .then(results => {
    if (results){
      return Promise.resolve(results);
    }else 
    {
      return Promise.resolve(-1);
    }
  })
  .catch((err) => {

    Promise.resolve(err);
  })
  
};

module.exports = {
  getMessages,
  sendMessage,
};