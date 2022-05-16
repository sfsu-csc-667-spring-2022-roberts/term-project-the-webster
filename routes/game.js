const express = require("express");
const io = require('../socket/index')
const router = express.Router();
//temp import, will need to be encapsulated into models/gameboard
const game = require("../db/game");
//models imports
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");

const gameTiles = require("../models/gameTiles");
const session = require("express-session");
// const frontend = require("../public/javascript/frontend")

// const gameTilesModel = require("../models/gameTiles");
const { multi } = require("../db");


router.get("/create", (request, response) => {

  // let currentUser = 1; // don't hard code this, get from params
  if (request.session) {

    let currentUser = request.session.user_id;
    console.log("current user is ", currentUser);
    game.createGame(currentUser)
      .then((game_id) => {
        // do socket thingy
        response.redirect(`/lobby/${game_id}`);
      })
  } else {
    console.log("no sesson in create");
  }


});

const turnHandler = async (request, gameId, userId, tileCount, currentTurn) => {
  if (currentTurn == 0) {
    console.log("----first turn ------");
    // request.app.get("io").to("room" + gameId).emit("first-turn");
    if (tileCount.length == 0) {
      await gameTiles.getInitialHand(gameId, userId)
      .then(result => {
        console.log("result in turnHandler:");
        console.log(result);
        return Promise.resolve(result);
      })
      .catch(err => {
        console.log("err: " + err);
      })
    }
    // request.app.get("io").to("room" + gameId).emit("first-turn");
  } else {
    request.app.get("io").to("room" + gameId).emit("not-first-turn");
    console.log("---- not the first turn ------");
    gameTiles.getPlayerHand(gameId, userId)
    .then(result => {
      return Promise.resolve(result);
    })
    .catch(err => {
      console.log("err: " + err);
    })
  }
}

router.get("/:id", async (request, response) => {
  //window.location.pathname
  let id = request.params;
  if (request.session) {
    var userId = request.session.user_id;
    var gameId = request.params.id;
  } //HANDLE POTENTIAL ERROR FROM NO SESSION 
  let playerHand = [];
  var currentTurn;
  var cells;
  var tileCount;
  console.log("in game route ", scoreBoard.getPlayers(id.id));
  game.getPlayerHand(gameId, userId)
    .then(tileCountResult => {
      tileCount = tileCountResult;
      console.log("tileCount: " + tileCount);
      game.getGameTurn(gameId)
        .then(async gameTurn => {
          currentTurn = gameTurn.current_turn;
          await turnHandler(request, gameId, userId, tileCount, currentTurn)
          .then((result) => {
            playerHand = result;
          game.getEmptyGrid()
            .then((cellsResult) => {
              cells = cellsResult;
              game.getGameUsers2(gameId)
                .then(gameUsers => {
                  var currentUser;
                  console.log("gameUsers");
                  console.log(gameUsers);
                  console.log("---userID");
                  console.log(userId);
                  for (i = 0; i < gameUsers.length; i++) {
                    if (gameUsers[i].user_id == userId) {
                      currentUser = gameUsers[i];
                    }
                  }
                  console.log("currentTurn: " + currentTurn);
                  console.log("currentUser");
                  console.log(currentUser);
                  var turn = currentTurn == currentUser.order;
                  request.app.get("io").emit("", { turn: turn });
                })
            })
            .then(() => {
              gameTiles.parsePlayerHandForHTML(gameId, userId)
                .then(playerTiles => {
                  playerHand = playerTiles;
                }).then(() => {
                  response.render("game", {
                    style: "gameStyle",
                    boardSquares: cells,
                    //tiles: playerHand,
                    tiles: playerHand,
                    tilesInBag: gameTiles.getNumTilesInBag,
                    messages: chat.getMessages(),
                    //isReady: true,
                    //broken call 
                    //players: scoreBoard.getPlayers(id.id),
                  });
                });
            })
          });
          Promise.resolve(1);
        })
    })
    .catch((error) => {
      Promise.reject(error);
    });
})

router.get("/:id/join", (request, response) => {
  console.log("join  ", request.params.id);
  if (request.session) {
    let userId = request.session.user_id;
    var gameId = request.params.id;

    game.joinGame(gameId, userId)
      .then(() => {
        response.redirect(`/game/${gameId}`);
        // Broadcast to game socket that a user has joind the game
      })
      .catch((error) => {
        console.log(error);
        response.redirect("/browseLobby");
      });
  }
  else {
    console.log("NO SESSION DETECTED IN JOIN")

  }
});

router.post("/:id/nextTurn", (request, response) => {
  console.log(request.params);
  const gameID = request.params.id;
  console.log(gameID);
  var gameUsers;
  game.getGameUsers2(gameID)
    .then(users => {
      gameUsers = users;
      console.log("--- users ----");
      console.log(gameUsers);
    })
    .then(() => {
      game.getGameTurn(gameID)
        .then(result => {
          let gameTurn = result.current_turn;
          console.log("current game turn");
          console.log(gameTurn);
          game.updateGameTurn(gameID, (gameTurn + 1) > gameUsers.length ? 1 : (gameTurn + 1))
            .then(newGameTurn => {
              console.log("please work");
              console.log(newGameTurn);
              request.app.get("io").sockets.to("room" + gameID).emit("turn-update", { newGameTurn: newGameTurn });
            })
        })
    })
  response
    .status(200);
})

router.post("/:id/playWord", (request, response) => {

  const { id } = request.params;
  const wordData = request.body;
  let word_placed;
  console.log(request.body)

  console.log(`HANDLE THIS WORD IN GAME ${id}`);

  const res_wordData = { wordData }

  const tiles = res_wordData["wordData"]
  wordifyTiles(tiles).then(result => {
    word_placed = result.toLowerCase()

    gameBoard.isWordValid(word_placed)
      .then(result => {
        console.log("IS WORD VALID ? " + result)
        if (result == true) {
          getPointsPerWord(tiles)
            .then(result => {
              console.log(word_placed + " is worth " + result + " points.")
              areTilesAdjacent(tiles)
                .then(result => {

                  if (result) {
                    console.log("  WORD IS VALID ")
                    console.log("b4 EMITTING VALID WORD")
                    request.app.get("io").emit("valid-word")
                    console.log("AFTER EMITTING VALID WORD")
                  }
                  else {
                    console.log(" CANNOT PLAY THAT WORD! ")
                  }


                }).catch(err => {
                  console.log("ERROR" + err)
                })


            }).catch(err => {
              console.log("ERR " + err)
            })
        } else {
          console.log(" CANNOT PLAY THAT WORD! ")
        }
      }).catch(err => {
        console.log("ERROR " + err)
      })

  }).catch(err => {
    console.log("ERROR!! " + err)
  })



  response
    .status(200)
    .json(res_wordData);


  // Send a game update via websocket
  // socket.emit("game-updated", {
  /* game state data */

  //makeTilesInPlay(tiles, id);


});


async function wordifyTiles(tiles) {
  let word = "";
  for (const x of tiles) {
    word += String(x.letter)
  }

  return word;
}


async function isAdjacentHorizontally(tiles) {

  let x_coords = []
  let row_val = tiles[0].x

  for (const i of tiles) {
    if (row_val != i.x) {
      return false
    }
    console.log(i.x + " == " + row_val)
    x_coords.push(i.y)


  }

  console.log(x_coords)
  const length = x_coords.length
  const last = x_coords[length - 1]
  const first = (x_coords[0])

  const diff = (last - first + 1)

  return (diff == length)

}


async function isAdjacentVertically(tiles) {


  let y_coords = []
  let col_val = tiles[0].y

  for (const i of tiles) {
    if (col_val != i.y) {
      return false
    }
    console.log(i.y + " == " + col_val)
    y_coords.push(i.x)


  }

  console.log("\n\n\n\n")
  console.log(y_coords)
  console.log("\n\n\n\n")

  console.log(y_coords)
  const length = y_coords.length
  const last = y_coords[length - 1]
  const first = (y_coords[0])

  const diff = (last - first + 1)


  return (diff == length)



}

async function areTilesAdjacent(tiles) {

  const x = await isAdjacentHorizontally(tiles)

  const y = await (isAdjacentVertically(tiles))

  console.log(x)
  console.log(y)

  return x || y
}



async function getPointsPerWord(tiles) {
  let points = 0;
  let word_multiplier = 1;
  let total_points;
  for (const i of tiles) {

    const _x = i.x
    const _y = i.y
    await scoreBoard.getMultiplier(_x, _y).then(result => {

      const multipliers = (result[0])

      console.log(multipliers.letter_multiplier)
      console.log(multipliers.word_multiplier)

      word_multiplier *= Number(multipliers.word_multiplier)

      const initial_val = Number(i.value)

      const adjusted_val = initial_val * Number(multipliers.letter_multiplier)

      points += adjusted_val


      total_points = points * word_multiplier


    }).catch(err => {
      console.log("ERROR " + err)
    })

  }

  return total_points;

}

async function makeTilesInPlay(tiles, gameId) {
  let promises = [];
  for (i = 0; i < tiles.length; i++) {
    promises.push(game.placeTile(tiles[i].id, tiles[i].x, tiles[i].y, gameId));
  }
  // placeTile = (tile_id, x, y, game_id)
  return Promise.all(promises)
    .then(results => {
      if (results) { return Promise.resolve(true) }
    }).catch(err => {
      console.log(err);
    })
}




module.exports = router;
