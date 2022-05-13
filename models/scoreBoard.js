const game = require("../db/game");
const db = require('../db/index');





// const getPlayers = () => {
//     players = [
//         {
//         name: "jack",
//         id: 1, 
//         score: getPlayersScore(1,1)
//         }, 
//         {
//           name: "kris", 
//           id: 2, 
//           score: getPlayersScore(1,2)
//         },
//         {
//           name: "kyle",
//           id: 11, 
//           score: getPlayersScore(1,3)
//           },
//         {
//             name: "kyle",
//             id: 11, 
//             score: getPlayersScore(1,4)
//         }
//       ];
//       return players;
// };

const getPlayersScore = (game_id, game_user_id) => {
  db.any(`SELECT score FROM game_users WHERE game_id=$1 AND user_id=$2`, [game_id,game_user_id])
  .then(results => {
    if(results) {
      // console.log(results);
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

const getPlayersId = (game_id) => {
  db.any('SELECT user_id FROM game_users WHERE game_id=$1', [game_id])
  .then(results => {
    if(results) {
      return Promise.resolve(results);
    }
    else {
      return Promise.resolve(-1);
    }
  })
  .catch( (err) => {
    Promise.resolve(err);
  })
};

module.exports = {
  // getPlayers,
  getPlayersScore,
  getPlayersId,
};