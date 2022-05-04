const game = require("../db/game");
const db = require('../db');

const getPlayers = () => {
    players = [
        {
        name: "jack",
        id: 1, 
        score: getPlayersScore(1,1)
        }, 
        {
          name: "kris", 
          id: 2, 
          score: getPlayersScore(1,2)
        },
        {
          name: "kyle",
          id: 11, 
          score: getPlayersScore(1,3)
          },
        {
            name: "kyle",
            id: 11, 
            score: getPlayersScore(1,4)
        }
      ];
      return players;
};

const getPlayersScore = (game_id, game_user_id) => {
  db.any(`SELECT score FROM game_users WHERE game_id=$1 AND user_id=$2`, [game_id,game_user_id])
  .then(results => {
    if(results) {
      console.log(results);
      Promise.resolve(results);
    }
    else {
      Promise.resolve(-1);
    }
  })
  .catch((err)=> {
    Promise.reject(err);
  })
};

const getPlayersId = (gameId) => {
  return Math.round( (Math.random() * 1000) );
};

module.exports = {
  getPlayers,
  getPlayersScore,
  getPlayersId,
};