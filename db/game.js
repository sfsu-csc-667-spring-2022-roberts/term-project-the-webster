const db = require("./index");

const getEmptyGrid = () => db.any("SELECT * FROM game_grid ORDER BY x, y ASC");

const createGame = (userId) =>
  db
    .one('INSERT INTO games ("inLobby") VALUES (true) RETURNING id AS "gameId"')
    .then(({ gameId }) =>
      db.one(
        'INSERT INTO game_users ("gameId", "userId", "order") VALUES ($1, $2, 0) RETURNING "gameId"',
        [gameId, userId]
      )
    )
    .then(({ gameId }) =>
      db.any("SELECT * FROM tiles").then((tiles) => {
        // INSERT tiles INTO game_tiles (with default values) RETURNING "gameId" in random order
      })
    );

const joinGame = (gameId, userId) =>
  db.one(
    'INSERT INTO game_users ("gameId", "userId", "order") VALUES ($1, $2, 0) RETURNING "gameId"',
    [gameId, userId]
  );

module.exports = {
  getEmptyGrid,
  createGame,
  joinGame,
};