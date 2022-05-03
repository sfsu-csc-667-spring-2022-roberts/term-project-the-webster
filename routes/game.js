const express = require("express");
const router = express.Router();

//temp import, will need to be encapsulated into models/gameboard
const Game = require("../db/game");


//models imoorts 
const gameBoard = require("../models/gameBoard");
const scoreBoard = require("../models/scoreBoard");
const chat = require("../models/chat");
const gameTiles = require("../models/gameTiles");

router.get("/create",(request, response) => {
  const currentUser = 1; // don't hard code this, get from params

  Game.createGame(currentUser)
    .then(({game_id} ) => {
      console.log("gameId:" + game_id);
      response.redirect(`/game/${game_id}`);
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/lobby");
    });
});

router.get("/:id", (request, response) => {
   Game.getEmptyGrid()
    .then((cells) => {
      //this is where we call the functions from models 
      response.render("games", {
            style: "gameStyle", 
            boardSquares: cells,
            tiles: gameTiles.getPlayersHand(),
            tilesInBag: gameTiles.getNumTilesInBag,
            messages: chat.getMessages(),
            isReady: true,
            players: scoreBoard.getPlayers(),
            });
    })
    .catch((error) => {
      console.log(">", error);
      response.json({ error });
    });
});


router.get("/:id/join", (request, response) => {
  const userId = 1; // This should be based on the current logged in user

  Game.joinGame(gameId, userId)
    .then(({ gameId }) => {
      response.redirect(`/game/${gameId}`);
      // Broadcast to game socket that a user has joind the game
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/lobby");
    });
});

module.exports = router;
