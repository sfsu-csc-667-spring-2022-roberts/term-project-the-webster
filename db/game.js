const db = require("./index");

const getEmptyGrid = () => db.any("SELECT * FROM game_grid ORDER BY x, y ASC");

const createGame = (userId) =>
  db
    .one('INSERT INTO games ("in_lobby") VALUES (true) RETURNING id AS "game_id"')
    .then(( {game_id} ) =>
      db.one(
        'INSERT INTO game_users ("game_id", "user_id", "order") VALUES ($1, $2, 0) RETURNING game_id',
        [game_id, userId]
      )
    )
    .catch((err) => {
      Promise.reject(err);
    })
    // .then(({game_id}) => 
    //   db.any("SELECT * FROM tiles").then((tiles) => {
    //     // INSERT tiles INTO game_tiles (with default values) RETURNING "gameId" in random order
    //     data = db.one('INSERT INTO game_tiles ("game_id", "user_id", "tile_id", "order") VALUES (1,1,1, 0) RETURNING "game_id"');
    //     return data;
    //   })
    // );


const joinGame = (gameId, userId) =>
  db.one(
    'INSERT INTO game_users ("game_id", "user_id", "order") VALUES ($1, $2, 0) RETURNING "game_id"',
    [gameId, userId]
  );

const placeTile = (tile_id, x, y, game_id) => 
  db.any(
    `UPDATE game_tiles SET x_coordinate=$1, y_coordinate=$2, in_play=true WHERE game_id=$4 AND tile_id=$3`,
    [x, y, tile_id, game_id]
  )
  .catch((err) => {
    console.log("ERROR IN PLACE TILE IN DB/GAME.JS");
    Promise.reject(err);
  });

//get a random tile from game_tiles and insert it into the player's hand
const drawTile = (game_id, player_id) => {
  db.one(`SELECT tile_id FROM game_tiles WHERE game_id=$1 AND in_bag=true ORDER BY RANDOM() limit 1`, [game_id])
  .then( results => {
    db.any(`UPDATE game_tiles SET in_bag=false, user_id=$1 WHERE game_id=$2 AND tile_id=$3`,
    [player_id, game_id, results.tile_id]);
  })
  .catch((err) => {
    console.log("ERROR! IN DRAW TILES IN DB/GAME.JS");
    Promise.reject(err);
  })
}

//returns an array of tile_id jsons of all tile_ids in the player's hand
const getPlayerHand = (game_id, player_id) => {
  return db.any(`SELECT tile_id FROM game_tiles WHERE game_id=$1 AND user_id=$2 AND in_play=false`, [game_id, player_id])
  .then(results => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN getPlayerHand IN DB/GAME.JS");
    Promise.reject(err);
  })
}

const getInPlayTiles = (game_id) => {
  return db.any(`SELECT tile_id, x_coordinate, y_coordinate FROM game_tiles WHERE game_id=$1 AND in_play=true`, [game_id])
  .then(results => {
    // console.log("RESULTS ARE" ,results);
    return Promise.resolve(results);
  })
  .catch((err) => {
    console.log("ERROR IN getInPlayTiles IN DB/GAME.JS");
    Promise.reject(err);
  })
}

module.exports = {
  getEmptyGrid,
  createGame,
  joinGame,
  placeTile,
  drawTile,
  getPlayerHand,
  getInPlayTiles
};
