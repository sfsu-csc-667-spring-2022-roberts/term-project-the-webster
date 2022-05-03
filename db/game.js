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
    );
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

module.exports = {
  getEmptyGrid,
  createGame,
  joinGame,
};
