const express = require("express");
const io = require('../socket/index')
const router = express.Router();
//temp import, will need to be encapsulated into models/gameboard
const game = require("../db/game");
//models imports
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");
const user = require("../models/Users")
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
    game.getPlayerHand(gameId, userId)
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

  //console.log("join  ", request.params.id);
 
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


//                   if (result) {
//                     gameTiles.getTileDataForHTML(id).then( (tileData) => {
//                       console.log("tileData in gameroute socket ");
//                       console.log(tileData)
//                       // Promise.resolve(tileData);
                   
//                     console.log("  WORD IS VALID ")
//                     request.app.get("io").emit("valid-word", {tileData:tileData});
//                     console.log("AFTER EMITTING VALID WORD")
//                   })
//                   }
//                   else {
//                     console.log(" CANNOT PLAY THAT WORD! ")
//                   }

router.post("/:id/playWord", async (request, response) => {

  let userId = 0
  let current_turn = -1;
  let validTurn = false
  userId = request.session.user_id
  let response_json = "invalid turn"
  const { id } = request.params;
  const wordData = request.body;
  let player_data = []


  await game.getGameTurn(id).then(results => {
    console.log("CURRENT TURN RESULTS ==> ", results.current_turn)
    current_turn = results.current_turn

  }).catch(err => {
    console.log("ERROR", err)
  })



  await getGameUsers(id)
    .then(results => {
      for (const x of results) {
        player_data.push(x)
      }
      for (const i of player_data) {
        console.log(i.user_id, " --> ", userId)
        if (current_turn == 0 && i.order == 4 && i.user_id == userId) {
          console.log("FIRST PLAY , last user's turn ")
          validTurn = true
        }
        if (i.order == current_turn && i.user_id == userId) {

          // player's turn
          validTurn = true

        }
      }

    }).catch(err => {
      console.log("ERR GETTING GAME USERS", err)
    })

  console.log("IS TURN VALID? ", validTurn)

  if (validTurn == false) {
    console.log("\n\n\n NOT YOUR turn \n\n\n");

    request.app.get("io").sockets.to("room" + id).emit("invalid-turn")

    console.log("200 -> but not valid turn ")
      

    
    response
    .status(200)
    .json(response_json);


  } else {


    let word_placed;
    let letters = [];
    console.log(`HANDLE THIS WORD IN GAME ${id}`);

    const res_wordData = { wordData }

    const tiles = res_wordData["wordData"];

    gameTiles.getWords(tiles, id)
      .then(results => {
        const get_words = results
        console.log("GET WORDS RETURNS-> ", results);

        getLetters(results).then(results => {
          console.log("GET LETTERS RESULTS ", results)


          extractWords(results)
            .then(results => {
              const word_arr = results
              // console.log("PASSING these to get score ==> ", word_arr)
              areWordsValid(results)

                .then(results => {

                  if (results == true) {


                    console.log("VALID MOVE")

                    // gameTiles.getScoreFromWords(word_arr)
                    // .then(results => {
                    //   console.log(" score  = " ,results)
                    // }).catch(err => {
                    //   console.log("ERROR", err)
                    // })

                    // console.log("wordData", get_words);
                    getPointsPerWord(wordData).then(results => {
                      console.log("SCORE IS => ", results)




                    }).catch(err => {
                      console.log("ERROR", err)
                    })
                    // request.app.get("io").emit("valid-word")

                  }
                  else {
                    console.log("INVALID MOVE")
                  }

                })

            })
            .catch(err => {
              console.log("ERROR extracting words", err)
            })





        }).catch(err => {
          console.log("ERROR getting letters helper function", err)
        })


      }).catch(err => {
        console.log("ERROR ", err)
      })


    response_json = res_wordData


    response
    .status(200)
    .json(response_json);

  }

  
 

  // Send a game update via websocket
  // socket.emit("game-updated", {
  /* game state data */

  //makeTilesInPlay(tiles, id);


});

 
// async function getLetters(words) {
//   const _words = []
//   const letters = []
//   console.log("WORDS")
//   // console.log(words)
//   // console.log(words.length)
//   for (const x of words) {
//     for (const tile of x) {
//       // console.log("TILE " , tile , )
//       await gameTiles.getLetterFromTileId(tile.id)
//         .then(results => {
//           // letters.push(results.letter)
//           // console.log(results.letter)
//           letters.push(String(results.letter))

//           console.log("\n")
//         }).catch(err => {
//           console.log("ERROR GETTING LETTERS FROM TILE ID", err)
//         })
//     }
//     _words.push(letters)
//   }

//   return _words

// }


async function extractWords(arr) {
  const words = []

  for (const x of arr) {
    await wordifyTiles(x).then(results => {

      words.push(results)
    })

  }


  return words

}
 

async function wordifyTiles(tiles) {
  let word = "";
  for (const x of tiles) {
 
 
    word += String(x).toLowerCase()
 
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

  return x || y
}

async function areWordsValid(words) {

  let valid_word = false

  await gameTiles.checkValidWords(words)

    .then(results => {
      if (results == true) {
        valid_word = true
      }
    })
    .catch(err => {
      console.log("ERROR ", err)
    })

  return valid_word


 
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


async function getGameUsers(id) {
  let x = []
  await game.getGameUsers2(id)
    .then(results => {
      for (const res of results) {
        x.push(res)
      }


    }).catch(err => {
      console.log("ERROR", err)
    })
  return x

 
}




module.exports = router;
