const game = require("../db/game");
const db = require('../db/index');


const getPlayers = async (gameId) => {
  //returns a pending promise
    let data = await game.getGameUsers(gameId)
    console.log("get plaaaaayers", data[0].user_id);
    let list = [];
    for(player in data ){
      list.push(player);
    }
    console.log(list);
    return list;
};


const getPlayersScore = (game_id, game_user_id) => {
  return db.one(`SELECT score FROM game_users WHERE game_id=$1 AND user_id=$2`, [game_id,game_user_id])
  .then(results => {
    if(results) {
      return Promise.resolve(results);
    }
    else {
      return Promise.resolve(-1);
    }
  })
  .catch((err)=> {
    Promise.resolve(err);
  })
};

const updatePlayerScore = (game_id, game_user_id, score) => {
  return getPlayersScore(game_id, game_user_id)
  .then(results => {
    newScore = results.score +  score;
    return db.any(`UPDATE game_users SET score=$1 WHERE game_id=$2 AND user_id=$3 RETURNING score`
    ,[newScore, game_id, game_user_id])
    .then(results => {
      return Promise.resolve(results);
    })
  })
  .catch((err)=> {
    Promise.resolve(err);
  })

}

const getPlayersId = (game_id) => {
  return db.any('SELECT user_id FROM game_users WHERE game_id=$1', [game_id])
  .then(results => {
    if(results) {
      return Promise.resolve(results);
    }
    else {
      return Promise.resolve(-1);
    }
  })
  .catch( (err) => {
    console.log("ERROR IN getPlayersId IN models/scoreBoard");
    Promise.resolve(err);
  })
};

const getMultiplier = (x, y) => {
  return db.any(`SELECT letter_multiplier, word_multiplier FROM game_grid WHERE x=$1 AND y=$2`
  ,[x,y])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch( (err) => {
    console.log("ERROR IN getMultiplier IN models/scoreBoard");
    Promise.resolve(err);
  })
}

module.exports = {
  // getPlayers,
  getPlayersScore,
  getPlayersId,
  updatePlayerScore,
  getMultiplier,
  getPlayers,
};