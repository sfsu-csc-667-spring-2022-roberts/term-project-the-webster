const db = require("./index");

const getEmptyGrid = () => db.any("SELECT * FROM game_grid ORDER BY y, x ASC");

const createGame = (userId) =>
  db
    .one('INSERT INTO games ("in_lobby") VALUES (true) RETURNING id AS "game_id"')
    .then (({game_id}) => {
      db.any(`INSERT INTO game_tiles(tile_id, game_id) SELECT id , $1 FROM tiles`,[game_id]);
      return Promise.resolve(game_id);
    })
    .catch((err) => {
      return Promise.resolve(err);
    })


const joinGame = (gameId, userId) =>
  db.one(
    'INSERT INTO game_users ("game_id", "user_id", "order") VALUES ($1, $2, 0) RETURNING "game_id"',
    [gameId, userId]
  );

const placeTile = async (tile_id, x, y, game_id) => {
  console.log("INPUTS TO PLACETILES ARE", tile_id, x, y, game_id);
  return db.any(
    `UPDATE game_tiles SET x_coordinate=$1, y_coordinate=$2, in_play=true, in_bag=false WHERE game_id=$4 AND tile_id=$3 RETURNING tile_id`,
    [x, y, tile_id, game_id]
  )
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN PLACE TILE IN DB/GAME.JS");
    return Promise.resolve(err);
  });
}

const drawTile = (game_id, player_id, count) => {
    return db.any(`UPDATE game_tiles SET in_bag = false, user_id=$1 FROM
    (SELECT tile_id FROM game_tiles WHERE game_id=$2 AND in_bag=true ORDER BY RANDOM() limit $3) AS data_table
    WHERE game_tiles.tile_id = data_table.tile_id RETURNING game_tiles.tile_id`,
    [player_id, game_id, count])
  .then((tile_id) => {
    return Promise.resolve(tile_id);
  })
  .catch((err) => {
    console.log("ERROR! IN DRAW TILES IN DB/GAME.JS", err);
    return Promise.resolve(err);
  })
}

//returns an array of tile_id jsons of all tile_ids in the player's hand
const getPlayerHand = async (game_id, player_id) => {
  return db.any(`SELECT tile_id FROM game_tiles WHERE game_id=$1 AND user_id=$2 AND in_play=false`, [game_id, player_id])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN getPlayerHand IN DB/GAME.JS");
    return Promise.resolve(err);
  })
}

const getInPlayTiles = (game_id) => {
  return db.any(`SELECT tile_id, x_coordinate, y_coordinate FROM game_tiles WHERE game_id=$1 AND in_play=true`, [game_id])
  .then((results) => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN getInPlayTiles IN DB/GAME.JS");
    return Promise.resolve(err);
  })
}

const getGames = () => {
 return db.any('SELECT * FROM games')
  .then((results) => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN getGames() game.js in /db");
    return Promise.resolve(err);
  })
}

const getGameUsers = (game_id) => {
  return db.any('SELECT * FROM game_users WHERE game_id =$1', [game_id])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR in getGameUsers IN DB/GAMES.JS");
    return Promise.resolve(err);
  })
}

const getGameUsers2 = async (game_id) => {
  return db.any('SELECT * FROM game_users INNER JOIN users ON users.id = game_users.user_id WHERE game_id =$1', [game_id])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR in getGameUsers2 IN DB/GAMES.JS");
    return Promise.reject(err);
  })
}

const removeFromLobby = (game_id, user_id) => {
  return db.any(`DELETE FROM game_users WHERE game_id = $1 AND user_id = $2`, [game_id, user_id])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR in getGameUsers IN DB/GAMES.JS");
    return Promise.reject(err);
  })
}

const getGameById = (game_id) => {
  return db.one('SELECT * FROM games WHERE id=$1', [game_id])
}

const getAllGameInfo = () => {
  return db.any('SELECT * FROM games INNER JOIN game_users ON games.id = game_users.game_id INNER JOIN users ON game_users.user_id = users.id')
}

const getGameState = (gameId) => {
  gameState = [];
  return db.any(`SELECT * FROM game_tiles WHERE game_id=$1`, [gameId])
  .then(results => {
    gameState.push(results);
    return db.any(`SELECT * FROM game_users WHERE game_id=$1`, [gameId])
    .then(results => {
      gameState.push(results);
      return db.any(`SELECT * FROM games WHERE id=$1`, [gameId])
      .then(results => {
        gameState.push(results);
        return Promise.resolve(gameState);
      })
      .catch(err => {
        console.log("ERROR IN getGameState in db/game.js");
        return Promise.resolve(err);
      })
    })
  })
}

const updateGameUserOrder = (gameId, userId, order) => {
  return db.any(`UPDATE game_users SET "order"=$1 WHERE game_id=$2 AND user_id=$3`,[order, gameId, userId])
  .catch(err => {
    console.log("ERROR IN updateGameUserOrder in db/game.js");
    return Promise.resolve(err);
  })
}

const getGameUserOrder = (gameId, userId) => {
  return db.one(`SELECT "order" FROM game_users WHERE game_id=$1 AND user_id=$2`, [gameId, userId])
  .then(results => {
    return Promise.resolve(results.order);
  })
  .catch(err => {
    console.log("ERROR IN getGameUserOrder in db/game.js");
    return Promise.resolve(err);
  })
}

const updateGameTurn = async (gameId, turn) => {
  return db.one(`UPDATE games SET current_turn=$1 WHERE id=$2 RETURNING current_turn`, [turn, gameId])
  .then((result) => {
    return Promise.resolve(result);
  })
}

const getGameTurn = (gameId) => {
  return db.one(`SELECT current_turn FROM games WHERE id=$1`, [gameId])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch(err => {
    console.log("ERROR IN getGameTurn in db/game.js");
    return Promise.resolve(err);
  })
}

const incrementGameTurn = (gameId) => {
  return getGameTurn(gameId)
  .then(results => {
    updateGameTurn(gameId, results.current_turn + 1)
    .then(result => {
      return Promise.resolve(result);
    })
    .catch(err => {
      console.log("ERROR IN incrementGameTurn in db/game.js");
      return Promise.resolve(err);
    })
  })
}

const getUserNameFromId = (userId) => {
  return db.one("SELECT username FROM users WHERE id=?", [userId])
  .then(result => {
    return Promise.resolve(result); 
  })
}


module.exports = {
  getEmptyGrid,
  createGame,
  joinGame,
  placeTile,
  drawTile,
  getPlayerHand,
  getInPlayTiles,
  getGames,
  getGameUsers,
  getAllGameInfo,
  getGameById,
  getGameUsers2,
  removeFromLobby,
  getGameState,
  updateGameUserOrder,
  getGameUserOrder,
  updateGameTurn,
  incrementGameTurn,
  getGameTurn,
  getUserNameFromId,
};
