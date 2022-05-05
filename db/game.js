const db = require("./index");

const getEmptyGrid = () => db.any("SELECT * FROM game_grid ORDER BY x, y ASC");

const insertGames = (userId) => {
  return db.one('INSERT INTO games ("in_lobby") VALUES (true) RETURNING id AS "game_id"');
}

async function createGame(userId) {
  console.log("greetings everyone");
  game_id = await insertGames(userId);
  gameId = game_id.game_id;
  console.log(gameId);
  console.log("user_id: " + userId);
  console.log("test");
  db.any('SELECT * FROM tiles').then((tiles) => {
    console.log("tiles");
    console.log(tiles);
    db.any('INSERT INTO game_users ("game_id", "user_id", "order") VALUES ($1, $2, 0)', [gameId, userId])
    .then(() => {
      console.log("HIII");
      tiles.forEach(function (arrayItem) {
        var x = arrayItem.id;
        console.log("id: " + x);
        db.any('INSERT INTO game_tiles ("game_id", "user_id", "tile_id", "in_play", "in_bag", "x_coordinate", "y_coordinate", "order") VALUES (1, 1, $1, FALSE, TRUE, -1, -1, 0)', [x]);
      });
      /*db.one('INSERT INTO game_tiles ("game_id", "user_id", "tile_id", "order") VALUES (1, 1, 1, 0)').then(() => {
        return game_id;
      })*/
    })
  })
  return game_id;
       /*db.any("SELECT * FROM tiles").then((tiles) => {
         // INSERT tiles INTO game_tiles (with default values) RETURNINGs "gameId" in random order
         data = db.one(
           'INSERT INTO game_tiles ("game_id", "user_id", "tile_id", "order") VALUES (1,1,1,0) RETURNING "game_id"',
         [game_id, tiles]
           );
           console.log("hey what's up");
         return data; 
       })
      });*/
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
