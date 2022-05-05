const db = require("./index");

const getEmptyGrid = () => db.any("SELECT * FROM game_grid ORDER BY x, y ASC");

const insertGames = (userId) => {
  return db.one('INSERT INTO games ("in_lobby") VALUES (true) RETURNING id AS "game_id"');
}

async function createGame(userId) {
  game_id = await insertGames(userId);
  gameId = game_id.game_id;
  db.any('SELECT * FROM tiles').then((tiles) => {
    console.log("tiles");
    db.any('INSERT INTO game_users ("game_id", "user_id", "order") VALUES ($1, $2, 0)', [gameId, userId])
    .then(() => {
      tiles.forEach(function (arrayItem) {
        var x = arrayItem.id;
        db.any('INSERT INTO game_tiles ("game_id", "user_id", "tile_id", "in_play", "in_bag", "x_coordinate", "y_coordinate", "order") VALUES (1, 1, $1, FALSE, TRUE, -1, -1, 0)', [x]);
      });
    })
  })
  return game_id;
}

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
