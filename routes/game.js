const express = require("express");
const io = require('../socket/index')
const router = express.Router();
//temp import, will need to be encapsulated into models/gameboard
const game = require("../db/game");
//models imoorts
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");
const gameTiles = require("../models/gameTiles");
const session = require("express-session");
// const frontend = require("../public/javascript/frontend")



router.get("/create", (request, response) => {
  // let currentUser = 1; // don't hard code this, get from params
  if (request.session) {

    
    
    let currentUser = request.session.user_id;
    console.log("current user is ", currentUser);
    game.createGame(currentUser)
    .then((game_id) => {
      // do socket thingy
      emitTest();
      response.redirect(`/game/${game_id}`);
    })
  } else {
    console.log("no sesson in create");
  }
  
   function emitTest() {
    io.emit('test-event1');
  }

    /*game.createGame(currentUser)
      .then((game_id) => {
        console.log("gameId:" + game_id);

        response.redirect(`/game/${game_id}`);
      })*/

  //     .catch((error) => {
  //       console.log(error);
  //       response.redirect("/lobby");
  //     });
  // } else {
  //   console.log("HANDLE THIS ERROR WHERE USER_ID DOES NOT EXIST IN game.js");
 
  // }
  // });
});

router.get("/:id", (request, response) => {

  //window.location.pathname
  if(request.session){
    var userId = request.session.user_id;
    var gameId = request.params.id;
  } //HANDLE POTENTIAL ERROR FROM NO SESSION 
  let gameTiles = [];
  let playerHand = [];
  game.getEmptyGrid()
    .then((cells) => {
      game.getPlayerHand(gameId,userId)
      .then(playerTiles => {
        playerHand = playerTiles;
      })
      .then(useless => {
        response.render("game", {
            style: "gameStyle", 
            boardSquares: cells,
            tiles: playerHand,
            tilesInBag: gameTiles.getNumTilesInBag,
            messages: chat.getMessages(),
            isReady: true,
            players: scoreBoard.getPlayers(),
            });
      })
    
      Promise.resolve(1);
    })
    .catch((error) => {
      // console.log(">", error);
      // response.json({ error });
      Promise.reject(error);
    });
});
// response.render("game", {
//   style: "gameStyle", 
//   boardSquares: cells,
//   tiles: game.getPlayerHand(),
//   tilesInBag: gameTiles.getNumTilesInBag(),
//   // messages: chat.getMessages(),
  // isReady: true,
  // players: scoreBoard.getPlayers(),
  // });

router.get("/:id/join", (request, response) => {
  console.log("--------------------------test------JOINING-------------");
  console.log(request.params.id);
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

router.post("/:id/playWord", (request, response) => {

  const { id } = request.params;
  const { word } = request.body;

  response.status(200);

  console.log(`HANDLE THIS WORD IN GAME ${id}`);
  console.log(word);

  console.log("PLAAAAAAAAAAAYYYYYYY " + JSON.stringify(request.params.id));
  console.log("PLAAAAAAAAAAAYYYYYYY " + request.body); 
  //response.redirect("/game/" + request.params.id);


  // Send a game update via websocket
 // socket.emit("game-updated", {
    /* game state data */
  });
// });
module.exports = router;
