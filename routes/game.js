const express = require("express");
const router = express.Router();
const game = require("../db/game");
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");
const gameTiles = require("../models/gameTiles");

router.get("/create", (request, response) => {
  if (request.session) {
    let currentUser = request.session.user_id;
    game.createGame(currentUser)
      .then((game_id) => {
        response.redirect(`/lobby/${game_id}`);
      })
  } else {
    console.log("no session! ");
  }
});

const turnHandler = async (request, gameId, userId, tileCount, currentTurn) => {
  if (currentTurn == 0) {
    request.app.get("io").to("room" + gameId).emit("first-turn");
    if (tileCount.length == 0) {
      await gameTiles.getInitialHand(gameId, userId)
        .then(result => {
          return Promise.resolve(result);
        })
        .catch(err => {
          console.log("err: " + err);
        })
    }
  } else {
    request.app.get("io").to("room" + gameId).emit("not-first-turn");
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
  if (request.session) {
    var userId = request.session.user_id;
    var gameId = request.params.id;
  }

  let refreshed_tile_data_for_HTML = [];

  gameTiles.getTileDataForHTML(gameId)
    .then(results => {
      for (const x of results) {
        refreshed_tile_data_for_HTML.push(x);
      }
      request.app.get("io").sockets.emit('load-board-data', {
        boardData: refreshed_tile_data_for_HTML
      })
    }).catch(err => {
      console.log("ERROR", err)
    })

  let playerHand = [];
  var currentTurn;
  var cells;
  var tileCount;

  game.getPlayerHand(gameId, userId)
    .then(tileCountResult => {
      tileCount = tileCountResult;
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
                      for (i = 0; i < gameUsers.length; i++) {
                        if (gameUsers[i].user_id == userId) {
                          currentUser = gameUsers[i];
                        }
                      }

                      if (currentUser != undefined) {
                        var turn = currentTurn == currentUser.order;
                        request.app.get("io").emit("", { turn: turn });
                      }
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
                        tiles: playerHand,
                        tilesInBag: gameTiles.getNumTilesInBag,
                        messages: chat.getMessages(),
                        userId: userId,
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
});


router.post("/:id/nextTurn", (request, response) => {
  const gameID = request.params.id;
  var gameUsers;
  game.getGameUsers2(gameID)
    .then(users => {
      gameUsers = users;
    })
    .then(() => {
      game.getGameTurn(gameID)
        .then(result => {
          let gameTurn = result.current_turn;
          game.updateGameTurn(gameID, (gameTurn + 1) > gameUsers.length ? 1 : (gameTurn + 1))
            .then(newGameTurn => {
              request.app.get("io").sockets.to("room" + gameID).emit("turn-update", { newGameTurn: newGameTurn });
            })
        })
    })
  response
    .status(200);
})

router.post("/:id/playWord", async (request, response) => {
  let userId = 0;
  let current_turn = -1;
  let validTurn = false;
  userId = request.session.user_id;
  let response_json = "invalid turn";
  const { id } = request.params;
  const wordData = request.body;
  let player_data = [];

  await game.getGameTurn(id).then(results => {
    current_turn = results.current_turn;
  }).catch(err => {
    console.log("ERROR", err);
  })
  await getGameUsers(id)
    .then(results => {
      for (const x of results) {
        player_data.push(x);
      }
      for (const i of player_data) {
        if (current_turn == 0 && i.order == player_data.length && i.user_id == userId) {
          validTurn = true;
        }
        if (i.order == current_turn && i.user_id == userId) {
          validTurn = true;
        }
      }
    }).catch(err => {
      console.log("ERR GETTING GAME USERS", err);
    })
  if (validTurn == false) {
    request.app.get("io").sockets.to("room" + id).emit("invalid-turn");
    response
      .status(200)
      .json(response_json);
  } else {
    const res_wordData = { wordData };
    const tiles = res_wordData["wordData"];
    gameTiles.getWords(tiles, id)
      .then(results => {
        getLetters(results).then(results => {
          extractWords(results)
            .then(results => {
              areWordsValid(results)
                .then(results => {
                  if (results == true) {
                    getPointsPerWord(wordData).then(results => {
                      scoreBoard.updatePlayerScore(id, userId, results)
                        .then(results => {
                          let updatedScore = results;
                          makeTilesInPlay(res_wordData, id)
                            .then(results => {
                              let tile_data_for_HTML = [];
                              gameTiles.getTileDataForHTML(id)
                                .then(results => {
                                  for (const x of results) {
                                    tile_data_for_HTML.push(x);
                                  }
                                  let new_game_turn;
                                  game.updateGameTurn(id, (current_turn + 1) > player_data.length ? 1 : (current_turn + 1))
                                    .then(results => {
                                      new_game_turn = results;
                                      let tiles_spent = 0;
                                      tiles_spent = res_wordData["wordData"].length;
                                      game.drawTile(id, userId, tiles_spent)
                                        .then(results => {
                                          gameTiles.parsePlayerHandForHTML(id, userId)
                                            .then(results => {
                                              let player_hand = results;
                                              request.app.get("io").sockets.to("room" + id).emit("valid-word", {
                                                playerId: userId,
                                                playerScore: updatedScore,
                                                tileDataForHTML: tile_data_for_HTML,
                                                newGameTurn: new_game_turn,
                                                playerHand: player_hand,
                                                game_id: id
                                              })
                                            })
                                        })
                                    })
                                    .catch(err => {
                                      console.log("ERR", err);
                                    })
                                }).catch(err => {
                                  console.log("ERR ", err);
                                })
                            }).catch(err => {
                              console.log("ERROR", err);
                            })
                        }).catch(err => {
                          console.log("ERROR", err);
                        })
                    }).catch(err => {
                      console.log("ERR", err);
                    })
                  }
                  if (results == false) {
                    request.app.get("io").to("room" + id).emit("invalid-word", {
                    });
                  }
                })
            })
            .catch(err => {
              console.log("ERROR extracting words", err);
            })
        }).catch(err => {
          console.log("ERROR getting letters helper function", err);
        })
      }).catch(err => {
        console.log("ERROR ", err);
      })
    response_json = res_wordData;
    response
      .status(200)
      .json(response_json);
  }
});

async function getLetters(words) {
  const _words = []
  for (const x of words) {
    const tile_id_set = new Set();
    const letters = [];
    for (const tile of x) {
      tile_id_set.add(tile.id);
    }
    const unique_tiles = [...tile_id_set];
    for (const tile of unique_tiles) {
      await gameTiles.getLetterFromTileId(tile)
        .then(results => {
          letters.push(String(results.letter));
        }).catch(err => {
          console.log("ERROR GETTING LETTERS FROM TILE ID", err);
        })
    }
    let word = "";
    for (const i of letters) {
      word += i;
    }
    _words.push(word);
  }
  return _words;
}

async function extractWords(arr) {
  const words = [];
  for (const x of arr) {
    await wordifyTiles(x).then(results => {
      words.push(results);
    })
  }
  return words;
}

async function wordifyTiles(tiles) {
  let word = "";
  for (const x of tiles) {
    word += String(x).toLowerCase();
  }
  return word;
}


async function isAdjacentHorizontally(tiles) {
  let x_coords = [];
  let row_val = tiles[0].x;

  for (const i of tiles) {
    if (row_val != i.x) {
      return false;
    }
    x_coords.push(i.y);
  }
  const length = x_coords.length;
  const last = x_coords[length - 1];
  const first = (x_coords[0]);
  const diff = (last - first + 1);

  return (diff == length);
}

async function isAdjacentVertically(tiles) {
  let y_coords = [];
  let col_val = tiles[0].y;

  for (const i of tiles) {
    if (col_val != i.y) {
      return false;
    }
    y_coords.push(i.x);
  }
  const length = y_coords.length;
  const last = y_coords[length - 1];
  const first = (y_coords[0]);
  const diff = (last - first + 1);
  return (diff == length);
}

async function areTilesAdjacent(tiles) {
  const x = await isAdjacentHorizontally(tiles);
  const y = await (isAdjacentVertically(tiles));
  return x || y;
}

async function areWordsValid(words) {
  let valid_word = false;
  await gameTiles.checkValidWords(words)
    .then(results => {
      if (results == true) {
        valid_word = true;
      }
    })
    .catch(err => {
      console.log("ERROR ", err);
    })
  return valid_word;
}

async function getPointsPerWord(tiles) {
  let points = 0;
  let word_multiplier = 1;
  let total_points;
  for (const i of tiles) {
    const _x = i.x;
    const _y = i.y;
    await scoreBoard.getMultiplier(_x, _y).then(result => {
      const multipliers = (result[0]);

      word_multiplier *= Number(multipliers.word_multiplier);

      const initial_val = Number(i.value);
      const adjusted_val = initial_val * Number(multipliers.letter_multiplier);

      points += adjusted_val;
      total_points = points * word_multiplier;

    }).catch(err => {
      console.log("ERROR " + err);
    })
  }
  return total_points;
}

const makeTilesInPlay = async (tiles, gameId) => {
  let promises = [];
  let tile = tiles["wordData"];

  for (i = 0; i < tile.length; i++) {
    promises.push(game.placeTile(tile[i].id, tile[i].x, tile[i].y, gameId));
  }

  Promise.all(promises).then(results => {
  })
    .catch(err => {
      console.log("ERROR", err);
    })
}

async function getGameUsers(id) {
  let x = [];
  await game.getGameUsers2(id)
    .then(results => {
      for (const res of results) {
        x.push(res);
      }
    }).catch(err => {
      console.log("ERROR", err);
    })
  return x;
}

module.exports = router;